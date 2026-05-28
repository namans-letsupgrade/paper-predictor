import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { PredictionJob } from '@/lib/models/PredictionJob';
import { callClaude } from '@/lib/anthropic';
import { SYSTEM_PROMPT_13A, userPrompt13A } from '@/lib/prompts';
import { CBSE_CLASS10_MATHS_SEED } from '@/lib/seed/cbse-class10-maths';
import { buildChapterAnalytics, getFallbackChapters, RawChapter } from '@/lib/seed/builder';

/**
 * POST /api/cold-start
 * Seeds analytics for a board+class+subject without needing past paper uploads.
 * Uses either pre-built seed data (CBSE Cl.10 Maths) or Prompt 13A with programmatic fallback.
 */
export async function POST(req: NextRequest) {
  try {
    const { board, cls, subject } = await req.json();

    if (!board || !cls || !subject) {
      return NextResponse.json({ error: 'board, cls, subject required' }, { status: 400 });
    }

    await connectDB();

    // Check if a job already exists
    const existing = await PredictionJob.findOne({ board, class: cls, subject });
    if (existing) {
      return NextResponse.json({ message: 'Analytics already exist', job: existing }, { status: 200 });
    }

    let analyticsData: Record<string, unknown>;

    // Use pre-built seed data if available
    if (board === 'CBSE' && cls === '10' && subject === 'Mathematics') {
      analyticsData = CBSE_CLASS10_MATHS_SEED as unknown as Record<string, unknown>;
    } else {
      // Fall back to simplified Prompt 13A
      const result = await callClaude<{ chapters: RawChapter[] }>(
        SYSTEM_PROMPT_13A,
        userPrompt13A(board, cls, subject),
        2048
      );
      
      const rawChapters = result.data?.chapters || getFallbackChapters(subject);
      analyticsData = buildChapterAnalytics(board, cls, subject, rawChapters);
    }

    // Persist to DB
    const job = await PredictionJob.create({
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

    return NextResponse.json({ message: 'Cold start complete', jobId: job._id }, { status: 201 });
  } catch (err) {
    console.error('[cold-start]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
