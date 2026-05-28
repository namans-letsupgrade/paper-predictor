'use client';

import { use, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Params { id: string }

const DEMO_PAPER = {
  board: 'CBSE', class: '10', subject: 'Mathematics',
  examYear: 2025, confidenceScore: 81, confidenceLabel: 'High',
  sections: [
    {
      sectionName: 'Section A',
      questionType: 'mcq',
      instructions: 'Choose the correct option. Each question carries 1 mark.',
      marks: 10,
      questions: [
        {
          questionNumber: '1',
          questionText: 'The HCF of 96 and 404 is:',
          marks: 1, difficulty: 'easy', questionType: 'mcq',
          options: [{ label: 'A', text: '2' },{ label: 'B', text: '4' },{ label: 'C', text: '8' },{ label: 'D', text: '12' }],
          mapping: { chapter: 'Real Numbers', topic: "HCF using Euclid's algorithm" },
          predictionMeta: { confidenceScore: 85 },
          answer: { solution: "HCF(96, 404) using Euclid's division algorithm:\n404 = 96 × 4 + 20\n96 = 20 × 4 + 16\n20 = 16 × 1 + 4\n16 = 4 × 4 + 0\nHCF = 4", finalAnswer: 'B) 4' }
        },
        {
          questionNumber: '2',
          questionText: 'If the zeroes of the polynomial x² + (a+1)x + b are 2 and −3, then:',
          marks: 1, difficulty: 'medium', questionType: 'mcq',
          options: [{ label: 'A', text: 'a = −7, b = −1' },{ label: 'B', text: 'a = 5, b = −6' },{ label: 'C', text: 'a = 2, b = −6' },{ label: 'D', text: 'a = 0, b = −6' }],
          mapping: { chapter: 'Polynomials', topic: 'Zeroes of polynomial' },
          predictionMeta: { confidenceScore: 88 },
          answer: { solution: 'Sum of zeroes = 2 + (−3) = −1 = −(a+1)/1 → a+1 = 1 → a = 0\nProduct of zeroes = 2 × (−3) = −6 = b/1 → b = −6', finalAnswer: 'D) a = 0, b = −6' }
        },
        {
          questionNumber: '3',
          questionText: 'The discriminant of 4x² − 3x + 7 = 0 is:',
          marks: 1, difficulty: 'easy', questionType: 'mcq',
          options: [{ label: 'A', text: '103' },{ label: 'B', text: '−103' },{ label: 'C', text: '104' },{ label: 'D', text: '−104' }],
          mapping: { chapter: 'Quadratic Equations', topic: 'Nature of roots' },
          predictionMeta: { confidenceScore: 92 },
          answer: { solution: 'D = b² − 4ac = (−3)² − 4(4)(7) = 9 − 112 = −103', finalAnswer: 'B) −103' }
        },
        {
          questionNumber: '4',
          questionText: 'The 12th term of the AP: 4, 9, 14, … is:',
          marks: 1, difficulty: 'easy', questionType: 'mcq',
          options: [{ label: 'A', text: '54' },{ label: 'B', text: '59' },{ label: 'C', text: '64' },{ label: 'D', text: '69' }],
          mapping: { chapter: 'Arithmetic Progressions', topic: 'nth term formula' },
          predictionMeta: { confidenceScore: 90 },
          answer: { solution: 'a = 4, d = 5, n = 12\naₙ = a + (n−1)d = 4 + 11×5 = 4 + 55 = 59', finalAnswer: 'B) 59' }
        },
        {
          questionNumber: '5',
          questionText: 'In △ABC, if DE ∥ BC, AD = 3cm, DB = 5cm and AE = 4.5cm, then EC equals:',
          marks: 1, difficulty: 'medium', questionType: 'mcq',
          options: [{ label: 'A', text: '6 cm' },{ label: 'B', text: '7 cm' },{ label: 'C', text: '7.5 cm' },{ label: 'D', text: '8 cm' }],
          mapping: { chapter: 'Triangles', topic: 'Basic Proportionality Theorem' },
          predictionMeta: { confidenceScore: 91 },
          answer: { solution: 'By BPT: AD/DB = AE/EC\n3/5 = 4.5/EC\nEC = 4.5 × 5/3 = 7.5 cm', finalAnswer: 'C) 7.5 cm' }
        },
      ],
    },
    {
      sectionName: 'Section B',
      questionType: 'short_answer',
      instructions: 'Answer the following questions. Each question carries 2 marks.',
      marks: 20,
      questions: [
        {
          questionNumber: '21',
          questionText: 'Find the zeroes of p(x) = x² − 3x − 10 and verify the relationship between zeroes and coefficients.',
          marks: 2, difficulty: 'medium', questionType: 'short_answer', options: null,
          mapping: { chapter: 'Polynomials', topic: 'Zeroes and coefficients' },
          predictionMeta: { confidenceScore: 87 },
          answer: { solution: 'p(x) = (x − 5)(x + 2)\nZeroes: α = 5, β = −2\nα + β = 3 = −(−3)/1 = −b/a ✓\nαβ = −10 = (−10)/1 = c/a ✓', finalAnswer: 'Zeroes: 5 and −2' }
        },
        {
          questionNumber: '22',
          questionText: 'Determine the nature of roots of 2x² − 5x + 3 = 0.',
          marks: 2, difficulty: 'easy', questionType: 'short_answer', options: null,
          mapping: { chapter: 'Quadratic Equations', topic: 'Nature of roots' },
          predictionMeta: { confidenceScore: 92 },
          answer: { solution: 'D = b² − 4ac = 25 − 24 = 1 > 0\nSince D > 0, roots are real and distinct.', finalAnswer: 'Real and distinct roots' }
        },
      ],
    },
    {
      sectionName: 'Section C',
      questionType: 'long_answer',
      instructions: 'Answer the following questions. Each question carries 3 marks.',
      marks: 30,
      questions: [
        {
          questionNumber: '26',
          questionText: 'A ladder 15 m long reaches a window 9 m above the ground on one side. Keeping its foot at the same point, the ladder is turned to reach a window 12 m high on the other side. Find the width of the street.',
          marks: 3, difficulty: 'medium', questionType: 'long_answer', options: null,
          mapping: { chapter: 'Triangles', topic: 'Pythagoras theorem application' },
          predictionMeta: { confidenceScore: 85 },
          answer: { solution: 'Side 1: √(15² − 9²) = √(225 − 81) = √144 = 12 m\nSide 2: √(15² − 12²) = √(225 − 144) = √81 = 9 m\nWidth = 12 + 9 = 21 m', finalAnswer: 'Width of street = 21 m' }
        },
      ],
    },
  ],
};

export default function PaperPage({ params }: { params: Promise<Params> }) {
  const { id }   = use(params);
  const [paper, setPaper]           = useState<typeof DEMO_PAPER | null>(null);
  const [loading, setLoading]       = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isPaid, setIsPaid]         = useState(false);

  useEffect(() => {
    fetch(`/api/paper/${id}`)
      .then(r => r.json())
      .then(data => setPaper((data.paper as unknown as typeof DEMO_PAPER) || DEMO_PAPER))
      .catch(() => setPaper(DEMO_PAPER))
      .finally(() => setLoading(false));
  }, [id]);

  const FREE_LIMIT = 5;
  const p = paper || DEMO_PAPER;

  if (loading) return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 12px' }} />
          <p style={{ color: '#6b7280' }}>Loading your predicted paper…</p>
        </div>
      </main>
      <Footer />
    </>
  );

  let questionCount = 0;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, background: '#f5f8ff', minHeight: '100vh' }}>

        {/* ── SUCCESS HEADER ── */}
        <div style={{
          background: '#f0fdf4',
          borderBottom: '1.5px solid #bbf7d0',
          padding: '16px 0',
        }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: '#16a34a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#15803d' }}>Your Predicted Paper is Ready!</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>AI has generated your predicted paper successfully.</div>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { label: 'Board', value: p.board },
                  { label: 'Class', value: p.class },
                  { label: 'Subject', value: p.subject },
                  { label: 'Prediction Confidence', value: `${p.confidenceScore}% [${p.confidenceLabel}]` },
                ].map(m => (
                  <div key={m.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>{m.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '24px' }}>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <button
              id="toggle-answers-btn"
              className="btn btn-primary"
              onClick={() => isPaid ? setShowAnswers(!showAnswers) : undefined}
              disabled={!isPaid}
              style={{ opacity: isPaid ? 1 : 0.6 }}
            >
              {showAnswers ? '🙈 Hide Answers' : '🔑 Show Answers'}{!isPaid ? ' 🔒' : ''}
            </button>
            <button className="btn btn-outline" disabled={!isPaid} style={{ opacity: isPaid ? 1 : 0.6 }}>
              📥 Download PDF {!isPaid ? '🔒' : ''}
            </button>
            <button className="btn btn-outline" disabled={!isPaid} style={{ opacity: isPaid ? 1 : 0.6 }}>
              🔄 Regenerate {!isPaid ? '🔒' : ''}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 20, alignItems: 'start' }}>

            {/* ── PAPER CONTENT ── */}
            <div>
              {/* General Instructions */}
              <div className="card" style={{ marginBottom: 16, padding: '16px 20px', background: '#eff6ff', border: '1.5px solid #bfdbfe' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8', marginBottom: 8 }}>General Instructions</div>
                <ul style={{ paddingLeft: 18, fontSize: 12, color: '#4b5563', lineHeight: 2 }}>
                  <li>All questions are compulsory.</li>
                  <li>Section A: 20 MCQs of 1 mark each (10 Marks)</li>
                  <li>Section B: 5 Very Short Answer questions of 2 marks each (20 Marks)</li>
                  <li>Section C: 6 Short Answer questions of 3 marks each (30 Marks)</li>
                  <li>Internal choices are given in some questions.</li>
                </ul>
              </div>

              {/* Paper Sections */}
              {p.sections.map((section, sIdx) => (
                <div key={sIdx} className="paper-section">
                  <div className="paper-section-header">
                    <div>
                      <div className="paper-section-title">{section.sectionName}</div>
                      <div className="paper-section-meta">{section.instructions}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-blue" style={{ fontSize: 11 }}>
                        {section.marks} Marks
                      </span>
                    </div>
                  </div>

                  {section.questions.map((q) => {
                    questionCount++;
                    const isLocked = !isPaid && questionCount > FREE_LIMIT;
                    return (
                      <div key={q.questionNumber} className={isLocked ? 'paywall-blur' : ''}>
                        <div className="question-item">
                          <div className="question-header">
                            <div className="question-num">Q{q.questionNumber}</div>
                            <div className="question-text">{q.questionText}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                              <span className="question-marks-badge">{q.marks}M</span>
                              <span className={`badge ${
                                q.difficulty === 'easy' ? 'badge-green' :
                                q.difficulty === 'medium' ? 'badge-amber' : 'badge-red'
                              }`} style={{ fontSize: 10 }}>{q.difficulty}</span>
                            </div>
                          </div>

                          {q.options && (
                            <div className="mcq-options">
                              {q.options.map(opt => (
                                <div key={opt.label} className="mcq-option">
                                  <div className="opt-label">{opt.label}</div>
                                  <span>{opt.text}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Metadata */}
                          <div style={{ paddingLeft: 38, marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <span className="badge badge-blue" style={{ fontSize: 10 }}>📚 {q.mapping.chapter}</span>
                            <span className="badge badge-green" style={{ fontSize: 10 }}>🎯 {(q.predictionMeta as { confidenceScore: number }).confidenceScore}% confidence</span>
                          </div>

                          {/* Answer */}
                          {showAnswers && isPaid && 'answer' in q && q.answer && (
                            <div style={{ margin: '12px 0 0 38px', padding: 14, background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', marginBottom: 6 }}>✅ Model Answer</div>
                              <pre style={{ fontSize: 12, color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.8, fontFamily: 'inherit' }}>
                                {(q.answer as { solution: string }).solution}
                              </pre>
                              {(q.answer as { finalAnswer: string }).finalAnswer && (
                                <div style={{ marginTop: 8, padding: '6px 12px', background: '#dcfce7', borderRadius: 8, fontSize: 13, fontWeight: 700, color: '#15803d' }}>
                                  ∴ {(q.answer as { finalAnswer: string }).finalAnswer}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Paywall */}
              {!isPaid && (
                <div style={{ position: 'relative', marginTop: -180 }}>
                  <div className="paywall-card" style={{ margin: '32px auto 0' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: '#111827' }}>
                      Unlock Full Paper
                    </h3>
                    <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 1.7 }}>
                      You&apos;ve seen the first 5 questions free. Unlock the complete predicted paper with <strong>35+ questions</strong>, model answers, PDF download, and regeneration.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 20 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 26, fontWeight: 900, color: '#2563eb' }}>₹99</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>1 Subject</div>
                      </div>
                      <div style={{ width: 1, background: '#e5eaf5' }} />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 26, fontWeight: 900, color: '#0ea5e9' }}>₹199</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>All Subjects</div>
                      </div>
                    </div>
                    <button
                      id="unlock-paper-btn"
                      className="btn btn-primary btn-full"
                      style={{ borderRadius: 10, marginBottom: 8 }}
                      onClick={() => setIsPaid(true)}
                    >
                      🚀 Unlock Full Paper — ₹99
                    </button>
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>Secure · Instant Access</p>
                    <button onClick={() => setIsPaid(true)} style={{ marginTop: 8, fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      [Demo: Skip payment]
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <aside style={{ position: 'sticky', top: 80 }}>

              {/* What's Included */}
              <div className="card" style={{ padding: 20, marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 14 }}>
                  What&apos;s Included
                </div>
                {[
                  { icon: '📋', label: 'Complete Question Paper', desc: 'All sections included' },
                  { icon: '✅', label: 'Answer Key (Detailed)', desc: 'Step-by-step solutions' },
                  { icon: '📊', label: 'Chapter Weightage', desc: 'Important topics flag' },
                  { icon: '🔍', label: 'Question Analysis', desc: 'Why these questions?' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 34, height: 34,
                      background: '#eff6ff', borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0,
                    }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{f.label}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paper Details */}
              <div className="card" style={{ padding: 20, marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 14 }}>
                  Paper Details
                </div>
                {[
                  { label: 'Total Marks', value: '80' },
                  { label: 'Duration', value: '3 Hours' },
                  { label: 'Sections', value: p.sections.length.toString() },
                  { label: 'Confidence', value: `${p.confidenceScore}% [${p.confidenceLabel}]` },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: 13, padding: '8px 0',
                    borderBottom: '1px solid #f3f4f6',
                  }}>
                    <span style={{ color: '#6b7280' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Regen modes */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 14 }}>
                  🔄 Regeneration Modes
                </div>
                {[
                  '🎯 High Probability Focus',
                  '🔥 Harder Paper',
                  '🌱 Easier Paper',
                  '📖 Chapter Focused',
                  '⚡ Last Minute Revision',
                ].map(m => (
                  <button
                    key={m}
                    className="btn btn-ghost btn-full"
                    disabled={!isPaid}
                    style={{ justifyContent: 'flex-start', fontSize: 13, marginBottom: 2, opacity: isPaid ? 1 : 0.5, borderRadius: 8 }}
                  >
                    {m} {!isPaid && '🔒'}
                  </button>
                ))}
              </div>

              {/* AI Tip */}
              <div style={{ marginTop: 14, padding: '12px 14px', background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe', fontSize: 12, color: '#4b5563', lineHeight: 1.6 }}>
                💡 <strong style={{ color: '#2563eb' }}>Tip:</strong> Review the paper and focus on high-weightage chapters for better preparation.
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
