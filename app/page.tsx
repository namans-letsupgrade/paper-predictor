'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BOARDS = ['CBSE', 'ICSE', 'Maharashtra State Board', 'JEE Main', 'JEE Advanced', 'NEET UG', 'MHT-CET'];
const CLASSES: Record<string, string[]> = {
  'CBSE': ['9', '10', '11', '12'],
  'ICSE': ['9', '10', '11', '12'],
  'Maharashtra State Board': ['9', '10', '11', '12'],
  'JEE Main': ['JEE Aspirant'],
  'JEE Advanced': ['JEE Aspirant'],
  'NEET UG': ['NEET Aspirant'],
  'MHT-CET': ['MHT-CET Aspirant'],
};
const SUBJECTS: Record<string, string[]> = {
  '9':  ['Mathematics', 'Science', 'Social Science', 'English'],
  '10': ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'],
  '11': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'],
  '12': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Economics', 'Accountancy'],
  'JEE Aspirant':  ['Mathematics', 'Physics', 'Chemistry'],
  'NEET Aspirant': ['Biology', 'Physics', 'Chemistry'],
  'MHT-CET Aspirant': ['Mathematics', 'Physics', 'Chemistry'],
};

const TESTIMONIALS = [
  {
    name: 'Aarav Sharma',
    meta: 'Class 12 · CBSE · Mathematics',
    emoji: '👦',
    rating: 5,
    text: 'PaperPredictor boosted my confidence so much! The predicted questions were very close to the actual exam.',
    tag: 'Exam Score Improved',
  },
  {
    name: 'Priya Nair',
    meta: 'Class 12 · CBSE · Physics',
    emoji: '👩',
    rating: 5,
    text: 'The topic prediction is incredibly useful. It helped me focus on the right chapters and score 95%!',
    tag: 'Focus on What Matters',
  },
  {
    name: 'Rohan Patel',
    meta: 'Class 10 · ICSE · Science',
    emoji: '🧑',
    rating: 4,
    text: 'Saved me so much time in revision. Section-wise papers helped me practice smartly and effectively.',
    tag: 'Time Saved in Revision',
  },
  {
    name: 'Ananya Gupta',
    meta: 'Class 12 · State Board · English',
    emoji: '👧',
    rating: 5,
    text: 'The section-wise practice is amazing. It feels like the papers are made just for our exams!',
    tag: 'Perfect Section-wise Practice',
  },
];

const FEATURES = [
  { icon: '🛡️', title: 'CBSE Ready', desc: 'Aligned with latest CBSE pattern' },
  { icon: '🏫', title: 'State Board Friendly', desc: 'Supports all major state boards' },
  { icon: '📊', title: 'Past 5 Years Analyzed', desc: 'AI analyzes past 5 years question trends' },
  { icon: '🔄', title: 'Regenerate with Pro', desc: 'Refresh predictions for better accuracy' },
];

export default function HomePage() {
  const router = useRouter();
  const [board, setBoard]     = useState('');
  const [cls, setCls]         = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleBoardChange = (b: string) => { setBoard(b); setCls(''); setSubject(''); };
  const handleClassChange = (c: string) => { setCls(c);   setSubject(''); };

  const handlePredict = async () => {
    if (!board || !cls || !subject) { setError('Please select board, class, and subject.'); return; }
    setError(''); setLoading(true);
    try {
      await fetch('/api/cold-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board, cls, subject }),
      });
      router.push(`/subject/${encodeURIComponent(board)}/${encodeURIComponent(cls)}/${encodeURIComponent(subject)}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const classOptions   = board ? (CLASSES[board] || []) : [];
  const subjectOptions = cls   ? (SUBJECTS[cls]   || []) : [];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>

        {/* ── HERO ── */}
        <section className="hero">
          {/* Background blobs */}
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />

          <div className="container" style={{ width: '100%' }}>
            <div className="hero-inner">
              {/* LEFT COLUMN */}
              <div className="hero-left" style={{ animation: 'fadeInUp 0.6s ease both' }}>
                <div className="hero-pill">
                  <span className="pill-dot" />
                  AI-Powered Exam Paper Predictions
                </div>

                <h1 className="hero-title">
                  Predict Your Next<br />
                  Exam Paper<br />
                  <span className="gradient-text">Using AI</span>
                </h1>

                <p className="hero-desc">
                  Upload past papers and syllabus, then get section-wise
                  paper predictions for the upcoming exam.
                </p>

                {/* Mobile-only animated stat card */}
                <div className="mobile-stat-card anim-float">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'var(--brand-primary-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20
                    }}>
                      📈
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)' }}>81% Average Accuracy</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>Based on last 5 years exam patterns</div>
                    </div>
                  </div>
                </div>

                {/* Selector Card */}
                <div className="hero-selector">
                  <div className="selector-grid">
                    <div>
                      <div className="selector-label">Board</div>
                      <div className="select-wrapper">
                        <span className="select-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 22V10l8-6 8 6v12"/><path d="M12 22V12"/></svg>
                        </span>
                        <select id="board-select" className="select-styled" value={board} onChange={e => handleBoardChange(e.target.value)}>
                          <option value="">Select Board</option>
                          {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <span className="select-chevron">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="selector-label">Class</div>
                      <div className="select-wrapper">
                        <span className="select-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                        </span>
                        <select id="class-select" className="select-styled" value={cls} onChange={e => handleClassChange(e.target.value)} disabled={!board}>
                          <option value="">Select Class</option>
                          {classOptions.map(c => <option key={c} value={c}>{c === 'JEE Aspirant' || c === 'NEET Aspirant' || c === 'MHT-CET Aspirant' ? c : `Class ${c}`}</option>)}
                        </select>
                        <span className="select-chevron">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="selector-label">Subject</div>
                      <div className="select-wrapper">
                        <span className="select-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        </span>
                        <select id="subject-select" className="select-styled" value={subject} onChange={e => setSubject(e.target.value)} disabled={!cls}>
                          <option value="">Select Subject</option>
                          {subjectOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="select-chevron">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p style={{ color: '#dc2626', fontSize: 12, marginBottom: 12 }}>⚠ {error}</p>
                  )}

                  <div className="predict-btn-container">
                    <button
                      id="predict-btn"
                      className="btn btn-primary btn-lg btn-full"
                      onClick={handlePredict}
                      disabled={loading}
                      style={{ borderRadius: 10, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      {loading ? (
                        <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Initialising…</>
                      ) : (
                        <>
                          <span style={{ fontSize: 15 }}>✦</span>
                          Predict Paper
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Secondary buttons below card */}
                <div className="selector-secondary-links">
                  <button className="secondary-link">
                    <span className="link-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </span>
                    View Past 5-Year Papers
                    <span className="link-arrow">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  </button>
                  <button className="secondary-link">
                    <span className="link-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                    </span>
                    See Sample Prediction
                    <span className="link-arrow">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  </button>
                </div>

                {/* Bottom Trust badges */}
                <div className="hero-trust-bar">
                  <div className="trust-badge">
                    <span className="trust-badge-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    </span>
                    Syllabus Based
                  </div>
                  <div className="trust-badge">
                    <span className="trust-badge-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    </span>
                    Past 5 Years Analyzed
                  </div>
                  <div className="trust-badge">
                    <span className="trust-badge-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                    </span>
                    Regenerate with Pro
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN — Visual Cards Stack & Predicted Paper Preview */}
              <div className="hero-right">
                {/* Visual outline circles decoration */}
                <div className="hero-bg-circles" aria-hidden="true">
                  <svg width="460" height="460" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="48" stroke="var(--brand-primary-light)" strokeWidth="0.8" strokeOpacity="0.8" />
                    <circle cx="50" cy="50" r="36" stroke="var(--brand-primary-light)" strokeWidth="0.6" strokeOpacity="0.6" />
                    <circle cx="50" cy="50" r="24" stroke="var(--brand-primary-light)" strokeWidth="0.4" strokeOpacity="0.4" strokeDasharray="1 1" />
                  </svg>
                </div>

                {/* Stacked statistics cards */}
                <div className="hero-middle-stack">
                  {/* Card 1: Chapter Weightage */}
                  <div className="hero-right-card">
                    <div className="right-card-title">Chapter Weightage</div>
                    <div className="donut-container">
                      <div className="donut-chart">
                        <div className="donut-inner">
                          <span className="donut-val">100%</span>
                          <span className="donut-lbl">Total</span>
                        </div>
                      </div>
                      <div className="donut-legend">
                        {[
                          { color: '#1B4FD8', label: 'Quadratic Equations', pct: '22%' },
                          { color: '#3B6FEA', label: 'Arithmetic Progressions', pct: '18%' },
                          { color: '#6490F5', label: 'Triangles', pct: '16%' },
                          { color: '#93B3FF', label: 'Statistics', pct: '14%' },
                          { color: '#C0D1FF', label: 'Circles', pct: '12%' },
                          { color: '#E5E7EB', label: 'Others', pct: '18%' },
                        ].map(l => (
                          <div key={l.label} className="legend-item">
                            <span className="legend-dot" style={{ background: l.color }} />
                            <span className="legend-label">{l.label}</span>
                            <span className="legend-pct">{l.pct}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Section-wise Probability */}
                  <div className="hero-right-card">
                    <div className="right-card-title">Section-wise Probability</div>
                    <div className="progress-bars-container">
                      {[
                        { label: 'Section A (MCQ)', val: 88 },
                        { label: 'Section B (Short)', val: 76 },
                        { label: 'Section C (Long)', val: 72 },
                        { label: 'Overall Paper Probability', val: 81 },
                      ].map(bar => (
                        <div key={bar.label} className="progress-bar-item">
                          <div className="bar-labels">
                            <span className="bar-label">{bar.label}</span>
                            <span className="bar-val">{bar.val}%</span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${bar.val}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Top Predicted Topics */}
                  <div className="hero-right-card">
                    <div className="right-card-title">Top Predicted Topics</div>
                    <div className="topics-chips-container">
                      {['Quadratic Equations', 'Polynomials', 'Triangles', 'AP', 'Circle Theorems', 'Statistics'].map(t => (
                        <span key={t} className="topic-chip">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Large Preview Paper Card */}
                <div className="hero-preview-paper-card">
                  <div className="preview-paper-header">
                    <div className="preview-predicted-badge">✦ Predicted</div>
                    <div className="preview-confidence-pill">
                      Confidence <span className="conf-bold">81%</span>
                    </div>
                  </div>
                  <div className="preview-paper-title-area">
                    <div className="preview-paper-title">Class 10 Mathematics</div>
                    <div className="preview-paper-subtitle">Board Exam 2026</div>
                    <div className="preview-title-underline" />
                  </div>

                  {/* MCQ Section */}
                  <div className="preview-section">
                    <div className="preview-section-title">
                      <span>Section A (MCQ)</span>
                      <span className="section-marks">10 Marks</span>
                    </div>
                    {[1, 2, 3].map(n => (
                      <div key={n} className="preview-question-row">
                        <span className="question-num">{n}.</span>
                        <div className="question-bar-placeholder" />
                        <div className="question-mcq-options">
                          {['A', 'B', 'C', 'D'].map(opt => (
                            <span key={opt} className="mcq-option-circle">{opt}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SA Section */}
                  <div className="preview-section">
                    <div className="preview-section-title">
                      <span>Section B (Short Answer)</span>
                      <span className="section-marks">20 Marks</span>
                    </div>
                    {[11, 12].map(n => (
                      <div key={n} className="preview-question-row">
                        <span className="question-num">{n}.</span>
                        <div className="question-bar-placeholder" />
                      </div>
                    ))}
                  </div>

                  {/* LA Section */}
                  <div className="preview-section">
                    <div className="preview-section-title">
                      <span>Section C (Long Answer)</span>
                      <span className="section-marks">30 Marks</span>
                    </div>
                    <div className="preview-question-row">
                      <span className="question-num">21.</span>
                      <div className="question-bar-placeholder" />
                    </div>
                  </div>

                  {/* Floating Prediction Confidence Badge */}
                  <div className="preview-floating-badge">
                    <div className="floating-badge-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2.5">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    </div>
                    <div className="floating-badge-text">
                      <div className="badge-title">AI Prediction</div>
                      <div className="badge-sub">Confidence</div>
                    </div>
                    <div className="floating-badge-val">81%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES BAR ── */}
        <div className="features-bar">
          <div className="container features-bar-inner">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-item">
                <div className="fi-icon">{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: 13 }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 400 }}>{f.desc}</div>
                </div>
              </div>
            ))}
            <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Try Free Prediction
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        {/* ── SOCIAL PROOF ── */}
        <section className="section section-bg">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center', marginBottom: 52 }}>
              {/* Left */}
              <div>
                <div className="section-pill">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  Loved by Students
                </div>
                <h2 className="section-title" style={{ marginBottom: 14 }}>
                  Trusted by Students<br />Before Every Exam
                </h2>
                <p className="section-subtitle">
                  Thousands of students use PaperPredictor to practice smarter
                  with past papers and AI-predicted questions.
                </p>
              </div>

              {/* Right — Rating card */}
              <div className="rating-card">
                <div className="rating-star">⭐</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span className="rating-num">4.8/5</span>
                    <span className="rating-label">Student Rating</span>
                  </div>
                  <div className="stars" style={{ margin: '6px 0' }}>⭐⭐⭐⭐⭐</div>
                </div>
                <div style={{ width: 1, background: '#e5eaf5', height: 56, flexShrink: 0 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 28, color: '#2563eb' }}>👥</div>
                  <div>
                    <div className="rating-num" style={{ fontSize: 24 }}>10,000+</div>
                    <div className="rating-label">Practice papers generated</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonials */}
            <div className="grid-4">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-author">
                    <div className="avatar" style={{
                      background: ['linear-gradient(135deg,#3b82f6,#2563eb)','linear-gradient(135deg,#7c3aed,#6d28d9)','linear-gradient(135deg,#059669,#047857)','linear-gradient(135deg,#d97706,#b45309)'][i]
                    }}>{t.emoji}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-meta">{t.meta}</div>
                    </div>
                  </div>
                  <div className="stars">{'★'.repeat(t.rating)}{'☆'.repeat(5-t.rating)}</div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {t.tag}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST STATS BAR ── */}
        <div className="trust-stats-bar">
          <div className="container trust-stats-inner">
            {[
              { icon: '🛡️', title: 'CBSE Ready',           desc: 'Aligned with latest CBSE pattern' },
              { icon: '🏫', title: 'State Board Friendly',  desc: 'Supports all major state boards' },
              { icon: '📊', title: 'Past 5 Years Analyzed', desc: 'AI analyzes past 5 years question trends' },
              { icon: '🔄', title: 'Regenerate with Pro',   desc: 'Refresh predictions for better accuracy' },
            ].map(s => (
              <div key={s.title} className="trust-stat-item">
                <div className="trust-stat-icon">{s.icon}</div>
                <div>
                  <div className="trust-stat-title">{s.title}</div>
                  <div className="trust-stat-desc">{s.desc}</div>
                </div>
              </div>
            ))}
            <div className="trust-cta">
              <button className="btn btn-white btn-lg" style={{ gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Try Free Prediction →
              </button>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
