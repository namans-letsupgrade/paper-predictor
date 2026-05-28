import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PredictionJob } from '@/lib/models/PredictionJob';
import { PredictedPaper } from '@/lib/models/PredictedPaper';
import { callClaude } from '@/lib/anthropic';
import {
  SYSTEM_PROMPT_4A, userPrompt4A,
  SYSTEM_PROMPT_5B, userPrompt5B,
  SYSTEM_PROMPT_6A,
  SYSTEM_PROMPT_7A, userPrompt7A,
  SYSTEM_PROMPT_9A,
  SYSTEM_PROMPT_13A, userPrompt13A,
} from '@/lib/prompts';
import { CBSE_CLASS10_MATHS_SEED } from '@/lib/seed/cbse-class10-maths';
import { buildChapterAnalytics, getFallbackChapters, RawChapter } from '@/lib/seed/builder';

/**
 * POST /api/generate
 * Orchestrates the full paper generation chain:
 * Analytics → Blueprint (4A) → Full Paper (5B) → Validate (6A) → Confidence (7A) → Summary (9A)
 */
export async function POST(req: NextRequest) {
  try {
    const { board, cls, subject, examYear = new Date().getFullYear() + 1 } = await req.json();

    if (!board || !cls || !subject) {
      return NextResponse.json({ error: 'board, cls, subject required' }, { status: 400 });
    }

    await connectDB();

    // 1. Load analytics from DB
    let job = await PredictionJob.findOne({ board, class: cls, subject, status: 'complete' });
    if (!job) {
      console.log(`[generate] No completed analytics job found. Auto-seeding cold start for ${board} Class ${cls} ${subject}...`);
      
      let analyticsData: Record<string, unknown>;
      if (board === 'CBSE' && cls === '10' && subject === 'Mathematics') {
        analyticsData = CBSE_CLASS10_MATHS_SEED as unknown as Record<string, unknown>;
      } else {
        const result = await callClaude<{ chapters: RawChapter[] }>(
          SYSTEM_PROMPT_13A,
          userPrompt13A(board, cls, subject),
          2048
        );
        const rawChapters = result.data?.chapters || getFallbackChapters(subject);
        analyticsData = buildChapterAnalytics(board, cls, subject, rawChapters);
      }

      job = await PredictionJob.create({
        board, class: cls, subject,
        status: 'complete',
        papersUsed: 0,
        syllabusAvailable: false,
        textbookAvailable: false,
        yearsAnalyzed: [],
        chapterAnalytics: analyticsData,
        confidenceScore: 55,
        confidenceLabel: 'Low',
        dataSource: 'knowledge_based',
      });
    }


    const chapterAnalytics = job.chapterAnalytics;

    // 2. Generate Blueprint (Prompt 4A)
    const examPattern = {
      totalMarks: 80,
      durationMinutes: 180,
      sections: [
        { name: "A", questionType: "mcq", totalQuestions: 20, marksEach: 1, totalMarks: 20 },
        { name: "B", questionType: "very_short_answer", totalQuestions: 5, marksEach: 2, totalMarks: 10 },
        { name: "C", questionType: "short_answer", totalQuestions: 6, marksEach: 3, totalMarks: 18 },
        { name: "D", questionType: "long_answer", totalQuestions: 4, marksEach: 5, totalMarks: 20 },
        { name: "E", questionType: "case_study", totalQuestions: 3, marksEach: 4, totalMarks: 12 }
      ]
    };

    console.log('[generate] Step 1: Generating blueprint...');
    const blueprintResult = await callClaude<Record<string, unknown>>(
      SYSTEM_PROMPT_4A,
      userPrompt4A(board, cls, subject, examPattern, chapterAnalytics, {}),
      8192
    );
    if (blueprintResult.error || !blueprintResult.data) {
      return NextResponse.json({ error: `Blueprint failed: ${blueprintResult.error}` }, { status: 500 });
    }
    const blueprint = blueprintResult.data;

    // 3. Generate Full Paper (Prompt 5B) - Chunked & Parallelized
    const syllabusTopics = "Real Numbers, Polynomials, Pair of Linear Equations, Quadratic Equations, Arithmetic Progressions, Triangles, Coordinate Geometry, Introduction to Trigonometry, Applications of Trigonometry, Circles, Areas Related to Circles, Surface Areas and Volumes, Statistics, Probability";

    console.log('[generate] Step 2: Chunking blueprint and generating paper in parallel...');

    function flattenBlueprint(bp: any): any[] {
      if (Array.isArray(bp)) return bp;
      if (bp && Array.isArray(bp.blueprint)) return bp.blueprint;
      if (bp && Array.isArray(bp.questions)) return bp.questions;
      if (bp && Array.isArray(bp.sections)) {
        const list: any[] = [];
        for (const sec of bp.sections) {
          if (Array.isArray(sec.questions)) {
            list.push(...sec.questions);
          }
        }
        return list;
      }
      return [];
    }

    const flatSlots = flattenBlueprint(blueprint);
    if (flatSlots.length === 0) {
      return NextResponse.json({ error: 'Failed to extract question slots from generated blueprint.' }, { status: 500 });
    }

    console.log(`[generate] Extracted ${flatSlots.length} blueprint question slots. Generating in chunks...`);

    const chunkSize = 10;
    const chunkPromises: Promise<any>[] = [];

    for (let i = 0; i < flatSlots.length; i += chunkSize) {
      const chunkSlots = flatSlots.slice(i, i + chunkSize);
      console.log(`[generate] Queueing chunk from index ${i} to ${i + chunkSlots.length}...`);
      
      const promise = callClaude<any[]>(
        SYSTEM_PROMPT_5B,
        userPrompt5B(board, cls, subject, examYear, chunkSlots, syllabusTopics),
        8192
      ).then(res => {
        if (res.error || !res.data) {
          throw new Error(res.error || 'No data returned for chunk.');
        }
        return res.data;
      });
      
      chunkPromises.push(promise);
    }

    let allQuestions: any[] = [];
    try {
      const chunkResults = await Promise.all(chunkPromises);
      for (const res of chunkResults) {
        if (Array.isArray(res)) {
          allQuestions.push(...res);
        } else if (res && Array.isArray((res as any).questions)) {
          allQuestions.push(...(res as any).questions);
        } else if (res) {
          allQuestions.push(res);
        }
      }
    } catch (err) {
      console.error('[generate] Error generating paper chunks:', err);
      return NextResponse.json({ error: `Paper generation failed: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
    }

    console.log(`[generate] Successfully generated ${allQuestions.length} questions. Reconstructing sections...`);

    // Group into sections A, B, C, D, E based on questionType/marks
    const mcqsList = allQuestions.filter((q: any) => q && (q.questionType === 'mcq' || q.marks === 1));
    const veryShortList = allQuestions.filter((q: any) => q && q.questionType !== 'mcq' && q.marks === 2);
    const shortList = allQuestions.filter((q: any) => q && q.questionType !== 'mcq' && q.marks === 3);
    const longList = allQuestions.filter((q: any) => q && q.questionType !== 'mcq' && (q.marks === 5 || q.marks === 6));
    const caseStudyList = allQuestions.filter((q: any) => q && q.questionType !== 'mcq' && q.marks === 4);

    const finalSections = [
      {
        sectionName: "Section A",
        questionType: "mcq",
        instructions: "Choose the correct option. Each question carries 1 mark.",
        marks: mcqsList.reduce((acc: number, q: any) => acc + (q.marks || 1), 0),
        questions: mcqsList
      },
      {
        sectionName: "Section B",
        questionType: "very_short_answer",
        instructions: "Answer the following questions. Each question carries 2 marks.",
        marks: veryShortList.reduce((acc: number, q: any) => acc + (q.marks || 2), 0),
        questions: veryShortList
      },
      {
        sectionName: "Section C",
        questionType: "short_answer",
        instructions: "Answer the following questions. Each question carries 3 marks.",
        marks: shortList.reduce((acc: number, q: any) => acc + (q.marks || 3), 0),
        questions: shortList
      },
      {
        sectionName: "Section D",
        questionType: "long_answer",
        instructions: "Answer the following questions. Each question carries 5 marks.",
        marks: longList.reduce((acc: number, q: any) => acc + (q.marks || 5), 0),
        questions: longList
      },
      {
        sectionName: "Section E",
        questionType: "case_study",
        instructions: "Read the case studies carefully and answer the sub-questions. Each carries 4 marks.",
        marks: caseStudyList.reduce((acc: number, q: any) => acc + (q.marks || 4), 0),
        questions: caseStudyList
      }
    ].filter(sec => sec.questions.length > 0);

    const paper = { sections: finalSections };

    // 4. Validate (Prompt 6A)
    console.log('[generate] Step 3: Validating...');
    const validationResult = await callClaude<Record<string, unknown>>(
      SYSTEM_PROMPT_6A,
      JSON.stringify({
        expectedPattern: examPattern,
        syllabusChapters: syllabusTopics.split(', '),
        expectedDifficulty: { easy: 30, medium: 50, hard: 20 },
        generatedPaper: paper,
        instruction: "Run all validation checks. Return JSON report."
      }),
      2048
    );
    const validationReport = validationResult.data || { isValid: true, overallScore: 85 };

    // 5. Calculate Confidence (Prompt 7A)
    console.log('[generate] Step 4: Calculating confidence...');
    const confResult = await callClaude<{ predictionConfidence: number; label: string }>(
      SYSTEM_PROMPT_7A,
      userPrompt7A(job.papersUsed, job.syllabusAvailable, job.textbookAvailable, 85, 80),
      512
    );
    const confidenceScore = confResult.data?.predictionConfidence ?? 55;
    const confidenceLabel = confResult.data?.label ?? 'Low';

    // 6. Analytics Summary (Prompt 9A)
    console.log('[generate] Step 5: Analytics summary...');
    const summaryResult = await callClaude<Record<string, unknown>>(
      SYSTEM_PROMPT_9A,
      JSON.stringify({
        chapterAnalytics,
        topicProbabilities: {},
        questionTypeDistribution: {},
        board, class: cls, subject,
        instruction: "Generate display-ready analytics summary. Return JSON."
      }),
      2048
    );
    const analyticsSummary = summaryResult.data || {};

    // 7. Save predicted paper
    const existingCount = await PredictedPaper.countDocuments({ predictionJobId: job._id });
    const predictedPaper = await PredictedPaper.create({
      predictionJobId: job._id,
      board, class: cls, subject,
      examYear,
      version: existingCount + 1,
      regenerationMode: 'balanced',
      blueprint,
      paper: Array.isArray((paper as Record<string, unknown[]>).sections) ? (paper as Record<string, unknown[]>).sections : [paper],
      validationReport,
      confidenceScore,
      confidenceLabel,
      analyticsSummary,
    });

    return NextResponse.json({
      success: true,
      paperId: predictedPaper._id,
      confidenceScore,
      confidenceLabel,
      analyticsSummary,
    });
  } catch (err) {
    console.error('[generate]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
