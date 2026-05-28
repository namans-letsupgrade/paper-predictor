'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CBSE_CLASS10_MATHS_SEED } from '@/lib/seed/cbse-class10-maths';

interface Params { id: string }

const TREND_MAP: Record<string, { label: string; cls: string; icon: string }> = {
  stable:           { label: 'Stable',   cls: 'trend-stable',  icon: '→' },
  increasing:       { label: 'Rising',   cls: 'trend-up',      icon: '↑' },
  decreasing:       { label: 'Falling',  cls: 'trend-down',    icon: '↓' },
  rebound_possible: { label: 'Rebound?', cls: 'trend-rebound', icon: '↺' },
  skipped_recently: { label: 'Skipped',  cls: 'trend-rebound', icon: '⚡' },
  cyclic:           { label: 'Cyclic',   cls: 'trend-stable',  icon: '⟲' },
};

const SEED = CBSE_CLASS10_MATHS_SEED;

export default function PredictPage({ params }: { params: Promise<Params> }) {
  const { id }       = use(params);
  const router       = useRouter();
  const ringRef      = useRef<SVGCircleElement>(null);
  const [generating, setGenerating] = useState(false);

  const analytics       = SEED.chapterAnalytics;
  const confidenceScore = 72;
  const circumference   = 2 * Math.PI * 70; // r=70

  useEffect(() => {
    if (ringRef.current) {
      setTimeout(() => {
        ringRef.current!.style.strokeDashoffset = String(
          circumference - (confidenceScore / 100) * circumference
        );
      }, 300);
    }
  }, [circumference]);

  const handleGeneratePaper = async () => {
    setGenerating(true);
    try {
      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: 'CBSE', cls: '10', subject: 'Mathematics' }),
      });
      const data = await res.json();
      if (data.paperId) router.push(`/paper/${data.paperId}`);
    } catch {/* */}
    finally { setGenerating(false); }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, background: '#f5f8ff', minHeight: '100vh' }}>

        {/* ── HEADER BAR ── */}
        <div style={{ background: 'white', borderBottom: '1px solid #e5eaf5', padding: '16px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <button onClick={() => router.back()} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 12, color: '#6b7280', fontWeight: 600,
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    Back to Subject
                  </button>
                </div>
                <h1 style={{ fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 900, letterSpacing: '-0.02em', color: '#111827' }}>
                  Mathematics — <span style={{ color: '#2563eb' }}>Prediction Dashboard</span>
                </h1>
                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                  CBSE · Class 10 · Pattern analysis based on 5-year historical data
                </p>
              </div>
              <button
                id="generate-paper-btn"
                className="btn btn-primary"
                onClick={handleGeneratePaper}
                disabled={generating}
              >
                {generating
                  ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating…</>
                  : <>📄 Generate Full Paper →</>}
              </button>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: '28px 24px' }}>

          {/* ── ROW 1: Confidence + Quick Stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, marginBottom: 20 }}>
            {/* Confidence Ring */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px', background: 'white' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 16 }}>
                Prediction Confidence
              </div>
              <div className="confidence-ring">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                  <circle className="ring-bg" cx="80" cy="80" r="70" />
                  <circle
                    ref={ringRef}
                    className="ring-fill"
                    cx="80" cy="80" r="70"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    stroke="url(#ringGrad)"
                  />
                </svg>
                <div className="ring-center">
                  <span className="confidence-score-val">{confidenceScore}</span>
                  <span className="confidence-label-text">Medium</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
                Upload papers to boost to <strong style={{ color: '#16a34a' }}>85+</strong>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {[
                { icon: '📚', label: 'Chapters', value: analytics.length,                                                           color: '#2563eb' },
                { icon: '🎯', label: 'High-Prob Topics', value: analytics.reduce((n, c) => n + c.topTopics.filter(t => t.probability >= 80).length, 0), color: '#0ea5e9' },
                { icon: '📈', label: 'Rising Chapters', value: analytics.filter(c => c.trend === 'increasing').length,             color: '#16a34a' },
                { icon: '⚡', label: 'Rebound Alert', value: analytics.filter(c => c.trend === 'rebound_possible').length,         color: '#d97706' },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: 'center', padding: '20px 12px' }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ROW 2: Chapter Bars + Question Type ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

            {/* Chapter Weightage */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20, color: '#111827' }}>Chapter Weightage</h3>
              {analytics.slice(0, 8).map(ch => (
                <div key={ch.chapter} className="chapter-bar-item">
                  <div className="chapter-bar-header">
                    <span className="chapter-bar-name">{ch.chapter}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`trend-chip ${TREND_MAP[ch.trend]?.cls || 'trend-stable'}`}>
                        {TREND_MAP[ch.trend]?.icon} {TREND_MAP[ch.trend]?.label}
                      </span>
                      <span className="chapter-bar-pct">{ch.averageWeightagePercent}%</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(ch.averageWeightagePercent * 6, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Question Type + Difficulty */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20, color: '#111827' }}>Question Type Distribution</h3>
              {Object.entries(SEED.questionTypeDistribution).map(([type, data]) => (
                <div key={type} className="chapter-bar-item">
                  <div className="chapter-bar-header">
                    <span className="chapter-bar-name" style={{ textTransform: 'capitalize' }}>
                      {type.replace(/_/g, ' ')}
                    </span>
                    <span className="chapter-bar-pct">{data.avgMarks}M · {data.percentOfPaper}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${data.percentOfPaper}%` }} />
                  </div>
                </div>
              ))}

              <div className="divider" />

              <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14, color: '#111827' }}>Difficulty Split</h4>
              {Object.entries(SEED.difficultyDistribution).map(([level, pct]) => (
                <div key={level} className="chapter-bar-item">
                  <div className="chapter-bar-header">
                    <span className="chapter-bar-name" style={{ textTransform: 'capitalize' }}>{level}</span>
                    <span className="chapter-bar-pct">{pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${pct}%`,
                      background: level === 'easy' ? 'linear-gradient(90deg,#16a34a,#22c55e)' :
                                  level === 'medium' ? 'linear-gradient(90deg,#2563eb,#3b82f6)' :
                                  'linear-gradient(90deg,#dc2626,#f87171)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ROW 3: High-Prob Topics + Insights ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 20 }}>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, color: '#111827' }}>
                🎯 High-Probability Topics
              </h3>
              {analytics.flatMap(ch =>
                ch.topTopics
                  .filter(t => t.probability >= 80)
                  .map(t => ({ ...t, chapter: ch.chapter }))
              ).sort((a, b) => b.probability - a.probability).slice(0, 10).map((topic, i) => (
                <div key={i} className="topic-item">
                  <div>
                    <div className="topic-name">{topic.topic}</div>
                    <div className="topic-chapter">{topic.chapter}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`trend-chip ${TREND_MAP[topic.trend]?.cls || 'trend-stable'}`}>
                      {TREND_MAP[topic.trend]?.icon}
                    </span>
                    <span className={`topic-prob ${topic.probability >= 85 ? 'high' : topic.probability >= 70 ? 'medium' : 'low'}`}>
                      {topic.probability}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9ca3af', marginBottom: 16 }}>
                  Trend Insights
                </h3>
                {[
                  { icon: '📈', label: 'Rising', chapters: SEED.overallInsights.increasingTrendChapters, cls: 'badge-green' },
                  { icon: '📉', label: 'Falling', chapters: SEED.overallInsights.decreasingTrendChapters, cls: 'badge-red' },
                  { icon: '⚡', label: 'Rebound', chapters: SEED.overallInsights.reboundCandidates, cls: 'badge-amber' },
                ].map(group => (
                  <div key={group.label} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                      {group.icon} {group.label}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(group.chapters as string[]).map((ch: string) => (
                        <span key={ch} className={`badge ${group.cls}`} style={{ fontSize: 10 }}>{ch}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="insight-card">
                <div className="insight-icon">🤖</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', marginBottom: 4 }}>AI Insight</div>
                  <div className="insight-text">
                    Focus on <strong>Quadratic Equations, Triangles, and Trigonometry</strong> — these carry ~35% of total marks every year.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── CTA ── */}
          <div style={{
            background: 'white',
            border: '1.5px solid #bfdbfe',
            borderRadius: 16,
            padding: '40px 32px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: '#111827' }}>
              Ready to See Your Predicted Paper?
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
              Generate a complete predicted paper with model answers based on this analytics.
            </p>
            <button
              id="generate-full-paper-btn"
              className="btn btn-primary btn-lg"
              onClick={handleGeneratePaper}
              disabled={generating}
            >
              {generating
                ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Generating…</>
                : '⚡ Generate Full Predicted Paper'}
            </button>
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 12 }}>First 5 questions free · Full paper ₹99</p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
