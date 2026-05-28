const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

import { CBSE_CLASS10_MATHS_SEED } from '@/lib/seed/cbse-class10-maths';

function getMockResponse<T>(systemPrompt: string, userPrompt: string): T {
  let board = 'CBSE';
  let cls = '10';
  let subject = 'Mathematics';
  try {
    const parsed = JSON.parse(userPrompt);
    if (parsed.board) board = parsed.board;
    if (parsed.class) cls = parsed.class;
    if (parsed.subject) subject = parsed.subject;
  } catch {
    const matchBoard = userPrompt.match(/"board":\s*"([^"]+)"/);
    if (matchBoard) board = matchBoard[1];
    const matchClass = userPrompt.match(/"class":\s*"([^"]+)"/) || userPrompt.match(/"cls":\s*"([^"]+)"/);
    if (matchClass) cls = matchClass[1];
    const matchSubject = userPrompt.match(/"subject":\s*"([^"]+)"/);
    if (matchSubject) subject = matchSubject[1];
  }

  const isColdStart = systemPrompt.includes('13A') || systemPrompt.includes('cold start') || systemPrompt.includes('chapter analytics');
  const isBlueprint = systemPrompt.includes('4A') || systemPrompt.includes('blueprint');
  const isFullPaper = systemPrompt.includes('5B') || systemPrompt.includes('predicted exam paper');
  const isValidation = systemPrompt.includes('6A') || systemPrompt.includes('validation report');
  const isConfidence = systemPrompt.includes('7A') || systemPrompt.includes('confidence');
  const isSummary = systemPrompt.includes('9A') || systemPrompt.includes('analytics summarization') || systemPrompt.includes('display-ready');

  if (isColdStart) {
    const seed = JSON.parse(JSON.stringify(CBSE_CLASS10_MATHS_SEED));
    seed.board = board;
    seed.class = cls;
    seed.subject = subject;
    return seed as unknown as T;
  }

  if (isBlueprint) {
    return {
      board, class: cls, subject,
      totalMarks: 80,
      durationMinutes: 180,
      sections: [
        { name: "A", questionType: "mcq", totalQuestions: 20, marksEach: 1, totalMarks: 20 },
        { name: "B", questionType: "very_short_answer", totalQuestions: 5, marksEach: 2, totalMarks: 10 },
        { name: "C", questionType: "short_answer", totalQuestions: 6, marksEach: 3, totalMarks: 18 },
        { name: "D", questionType: "long_answer", totalQuestions: 4, marksEach: 5, totalMarks: 20 },
        { name: "E", questionType: "case_study", totalQuestions: 3, marksEach: 4, totalMarks: 12 }
      ]
    } as unknown as T;
  }

  if (isFullPaper) {
    return {
      sections: [
        {
          sectionName: "Section A",
          questionType: "mcq",
          instructions: "Choose the correct option. Each question carries 1 mark.",
          marks: 10,
          questions: [
            {
              questionNumber: "1",
              questionText: "The HCF of 96 and 404 is:",
              marks: 1, difficulty: "easy", questionType: "mcq",
              options: [{ label: "A", text: "2" }, { label: "B", text: "4" }, { label: "C", text: "8" }, { label: "D", text: "12" }],
              mapping: { chapter: "Real Numbers", topic: "Core Concept" },
              predictionMeta: { confidenceScore: 92 },
              answer: { solution: "HCF(96, 404) = 4.", finalAnswer: "B" }
            }
          ]
        }
      ]
    } as unknown as T;
  }

  if (isValidation) {
    return { isValid: true, overallScore: 95 } as unknown as T;
  }

  if (isConfidence) {
    return { predictionConfidence: 81, label: "High" } as unknown as T;
  }

  if (isSummary) {
    return {
      topTopics: [{ topic: "Trigonometric identities", probability: 92, reason: "Highly recurrent 3M/5M question" }],
      chapterWeightage: [{ chapter: "Algebra", weightage: 35 }, { chapter: "Others", weightage: 65 }],
      questionTypeDistribution: [{ type: "MCQ", count: 20, marks: 20 }],
      trendInsights: ["Electricity numeric questions showing an upward trend"],
      aiInsight: "Focus on core derivations and formulas.",
      sectionProbabilities: [{ section: "Section A", probability: 92 }]
    } as unknown as T;
  }

  return {} as T;
}

export async function callClaude(systemPrompt: string, userPrompt: string, maxTokens: number = 4096) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'mock-key' || apiKey === 'your_anthropic_api_key_here') {
    console.log('[Claude Mock] Using local fallback mock response.');
    return getMockResponse<any>(systemPrompt, userPrompt);
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'Claude API error');
  }
  const text = data.content[0].text;
  const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

export async function callClaudeWithPDF(systemPrompt: string, userPromptJson: string, base64Data: string, maxTokens: number = 4096) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === 'mock-key' || apiKey === 'your_anthropic_api_key_here') {
    console.log('[Claude PDF Mock] Using local fallback mock response.');
    return getMockResponse<any>(systemPrompt, userPromptJson);
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: base64Data }
          },
          { type: "text", text: userPromptJson }
        ]
      }]
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'Claude API error');
  }
  const text = data.content[0].text;
  const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}
