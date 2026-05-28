'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ArrowLeft, Download, ChevronRight, BookOpen, FileText,
  Sparkles, CheckCircle, AlertTriangle, Calculator, Atom,
  FlaskConical, Leaf, Globe, TrendingUp, Receipt,
  BarChart2, Users, Clock, Star, Lock, RefreshCw,
} from 'lucide-react';

interface Params { board: string; cls: string; subject: string }

/* ── Board gradient configs ─────────────────────────────── */
const BOARD_CONFIG: Record<string, { gradient: string; accentHex: string; lightBg: string }> = {
  'CBSE':                    { gradient: 'linear-gradient(135deg,#1B4FD8 0%,#1440B0 100%)', accentHex: '#1B4FD8', lightBg: '#EEF2FF' },
  'ICSE':                    { gradient: 'linear-gradient(135deg,#1B4FD8 0%,#1440B0 100%)', accentHex: '#1B4FD8', lightBg: '#EEF2FF' },
  'JEE Main':                { gradient: 'linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)', accentHex: '#7C3AED', lightBg: '#F5F3FF' },
  'JEE Advanced':            { gradient: 'linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)', accentHex: '#7C3AED', lightBg: '#F5F3FF' },
  'NEET UG':                 { gradient: 'linear-gradient(135deg,#059669 0%,#047857 100%)', accentHex: '#059669', lightBg: '#ECFDF5' },
  'Maharashtra State Board': { gradient: 'linear-gradient(135deg,#D97706 0%,#B45309 100%)', accentHex: '#D97706', lightBg: '#FFFBEB' },
  'MHT-CET':                 { gradient: 'linear-gradient(135deg,#D97706 0%,#B45309 100%)', accentHex: '#D97706', lightBg: '#FFFBEB' },
};
const DEFAULT_CFG = BOARD_CONFIG['CBSE'];

/* ── Subject icon component ─────────────────────────────── */
function SubjectIcon({ subject, size = 64 }: { subject: string; size?: number }) {
  const p = { size, strokeWidth: 1.4, color: 'rgba(255,255,255,0.90)' };
  const s = subject.toLowerCase();
  if (s.includes('math'))                          return <Calculator {...p} />;
  if (s.includes('physic'))                        return <Atom {...p} />;
  if (s.includes('chem'))                          return <FlaskConical {...p} />;
  if (s.includes('bio'))                           return <Leaf {...p} />;
  if (s.includes('english'))                       return <BookOpen {...p} />;
  if (s.includes('social') || s.includes('hist') || s.includes('geo')) return <Globe {...p} />;
  if (s.includes('econ'))                          return <TrendingUp {...p} />;
  if (s.includes('account'))                       return <Receipt {...p} />;
  return <FileText {...p} />;
}

/* ── Dynamic SEO content ─────────────────────────────────── */
function getSubjectSEO(subject: string, board: string, cls: string) {
  const s = subject.toLowerCase();
  if (s.includes('math')) return {
    title: `${board} Class ${cls} Mathematics — Exam Pattern & Prediction`,
    body: `The ${board} Class ${cls} Mathematics exam follows an 80-mark pattern covering Algebra, Geometry, Trigonometry, Mensuration, and Statistics. Based on 5-year analysis, Quadratic Equations (12%), Triangles (12.5%), and Arithmetic Progressions (10%) consistently carry the highest weightage. Section A has 20 MCQs, Sections B–D include short and long answer questions, and Section E has case-study based problems. Our AI identifies recurring topic clusters and predicts which chapters will appear in your 2025 exam.`,
  };
  if (s.includes('physic')) return {
    title: `${board} Class ${cls} Physics — Exam Pattern & Prediction`,
    body: `${board} Class ${cls} Physics covers Optics, Electricity, Magnetic Effects, and Modern Physics across 70 marks theory + 30 marks practical. Analysis of 5 past papers shows Light and Electricity chapters consistently dominate with 40–50% combined weightage. Numericals from Ohm's Law, Mirror Formula, and Lens Formula appear every year. Our AI maps question type trends (conceptual vs. numerical) to help you prepare strategically.`,
  };
  if (s.includes('chem')) return {
    title: `${board} Class ${cls} Chemistry — Exam Pattern & Prediction`,
    body: `${board} Class ${cls} Chemistry exam spans Chemical Reactions, Acids & Bases, Metals & Non-metals, Carbon Compounds, and more. Our 5-year analysis reveals that Chemical Equations (balancing), Periodic Properties, and Carbon Chemistry are high-probability chapters appearing in every exam. Nomenclature and reaction type questions account for ~35% of marks. AI prediction helps you identify which chapters to prioritize.`,
  };
  if (s.includes('bio')) return {
    title: `${board} Class ${cls} Biology — Exam Pattern & Prediction`,
    body: `${board} Class ${cls} Biology covers Life Processes, Control & Coordination, Reproduction, Heredity, and Ecosystems. Based on 5 years of past papers, Life Processes and Reproduction consistently carry 30–40% combined weightage. Diagram-based questions (eye, heart, neuron) appear every year. Our AI predicts high-probability diagrams, definition questions, and long-answer topics for your upcoming exam.`,
  };
  return {
    title: `${board} Class ${cls} ${subject} — Exam Pattern & Prediction`,
    body: `Our AI analyzes 5 years of ${board} Class ${cls} ${subject} exam papers to identify recurring patterns, chapter weightage trends, and high-probability topics. Get detailed analytics on question type distribution, section-wise breakdowns, and trend analysis to focus your preparation on what matters most for the upcoming exam.`,
  };
}

/* ── Related subjects mapping ────────────────────────────── */
const RELATED: Record<string, string[]> = {
  Mathematics: ['Physics', 'Chemistry', 'Science', 'Statistics'],
  Physics:     ['Mathematics', 'Chemistry', 'Science'],
  Chemistry:   ['Physics', 'Biology', 'Science'],
  Biology:     ['Chemistry', 'Science', 'Environmental Science'],
  English:     ['Social Science', 'Hindi'],
  default:     ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
};

const PAST_PAPERS = [2025, 2024, 2023, 2022, 2021];

/* ── Quick stats ─────────────────────────────────────────── */
const QUICK_STATS = [
  { icon: BarChart2, label: '5 Years Analyzed', value: '5' },
  { icon: Star,      label: 'Prediction Score', value: '81%' },
  { icon: Users,     label: 'Students Used',    value: '10K+' },
  { icon: Clock,     label: 'Time to Generate', value: '~30s' },
];

export default function SubjectPage({ params }: { params: Promise<Params> }) {
  const { board, cls, subject } = use(params);
  const router    = useRouter();
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [dragOver, setDragOver] = useState(false);

  const b = decodeURIComponent(board);
  const c = decodeURIComponent(cls);
  const s = decodeURIComponent(subject);

  const cfg   = BOARD_CONFIG[b] || DEFAULT_CFG;
  const seo   = getSubjectSEO(s, b, c);
  const rel   = RELATED[s] || RELATED.default;
  const clsLabel = ['JEE Aspirant','NEET Aspirant','MHT-CET Aspirant'].includes(c) ? c : `Class ${c}`;

  /* data readiness (mock — real data from DB) */
  const papersAvail  = 5;
  const syllabusOk   = true;
  const textbookOk   = true;
  const quality      = papersAvail >= 4 ? 'High' : papersAvail >= 2 ? 'Medium' : 'Low';
  const qualityColor = quality === 'High' ? 'var(--success)' : quality === 'Medium' ? 'var(--warning)' : 'var(--danger)';

  const handlePredict = async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board: b, cls: c, subject: s }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      router.push(`/predict/${data.paperId}/overview`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* ── JSX ─────────────────────────────────────────────── */
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, background: 'var(--gray-50)', minHeight: '100vh' }}>

        {/* ── HERO BANNER ─────────────────────────────────────── */}
        <section className="subject-hero-banner" style={{ background: cfg.gradient, position: 'relative', overflow: 'hidden' }}>
          {/* decorative circles */}
          <div style={{
            position: 'absolute', top: -80, right: -80,
            width: 320, height: 320,
            background: 'rgba(255,255,255,0.06)', borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: -100, right: 120,
            width: 240, height: 240,
            background: 'rgba(255,255,255,0.04)', borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', top: 30, left: '40%',
            width: 160, height: 160,
            background: 'rgba(255,255,255,0.03)', borderRadius: '50%',
          }} />

          <div className="container subject-hero-container" style={{ padding: '28px 24px 40px', position: 'relative', zIndex: 1 }}>
            {/* Back + breadcrumb */}
            <div className="subject-hero-back" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              <button
                onClick={() => router.push('/')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: 600,
                  background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.20)',
                  borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
                  transition: 'background 200ms ease-out',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.20)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
              >
                <ArrowLeft size={14} />
                Back to Home
              </button>

              {/* breadcrumb */}
              <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>
                <span>/</span>
                <Link href="/" style={{ color: 'rgba(255,255,255,0.60)' }}>Home</Link>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.80)' }}>{b}</span>
                <ChevronRight size={12} />
                <span style={{ color: 'rgba(255,255,255,0.80)' }}>{clsLabel}</span>
                <ChevronRight size={12} />
                <span style={{ color: 'white', fontWeight: 600 }}>{s}</span>
              </div>
            </div>

            {/* Hero content row */}
            <div className="subject-hero-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
              <div style={{ flex: 1 }}>
                <div className="desktop-only" style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)',
                  marginBottom: 10,
                }}>
                  SUBJECT
                </div>
                <h1 className="subject-hero-title" style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(30px,4vw,42px)',
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  marginBottom: 14,
                }}>
                  {s}
                </h1>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  <span style={{
                    padding: '4px 12px',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 9999,
                    fontSize: 12, fontWeight: 600, color: 'white',
                  }}>{b}</span>
                  <span style={{
                    padding: '4px 12px',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 9999,
                    fontSize: 12, fontWeight: 600, color: 'white',
                  }}>{clsLabel}</span>
                </div>
                <p className="desktop-only" style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.80)',
                  lineHeight: 1.65,
                  maxWidth: 480,
                  marginBottom: 0,
                }}>
                  Access previous year papers, syllabus, and textbook to predict your next exam paper using AI analysis of 5-year patterns.
                </p>
              </div>

              {/* Subject icon — right */}
              <div className="desktop-only" style={{
                width: 120, height: 120,
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.18)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              }}>
                <SubjectIcon subject={s} size={64} />
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICK STATS STRIP ────────────────────────────────── */}
        <div suppressHydrationWarning className="quick-stats-strip" style={{ background: 'white', borderBottom: '1px solid var(--gray-200)' }}>
          <div className="container" style={{ padding: '14px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
              {QUICK_STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div suppressHydrationWarning key={stat.label} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 28px',
                    borderRight: i < QUICK_STATS.length - 1 ? '1px solid var(--gray-200)' : 'none',
                  }}>
                    <div suppressHydrationWarning style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: cfg.lightBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={16} color={cfg.accentHex} strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── TWO-COLUMN CONTENT ───────────────────────────────── */}
        <div className="container" style={{ padding: '32px 24px' }}>
          <div className="subject-layout-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24, alignItems: 'start' }}>

            {/* LEFT — Previous Year Papers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Card header */}
                <div style={{
                  padding: '18px 24px',
                  borderBottom: '1px solid var(--gray-200)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: cfg.lightBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FileText size={16} color={cfg.accentHex} strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>
                        Previous Year Papers
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 1 }}>
                        {PAST_PAPERS.length} papers available for download
                      </div>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    background: 'var(--success-light)',
                    color: 'var(--success)',
                    border: '1px solid #BBF7D0',
                    borderRadius: 9999,
                    fontSize: 12, fontWeight: 700,
                  }}>
                    All Free
                  </span>
                </div>

                {/* Paper rows */}
                <div style={{ padding: '8px 0' }}>
                  {PAST_PAPERS.map((year, i) => (
                    <div
                      key={year}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '13px 24px',
                        borderBottom: i < PAST_PAPERS.length - 1 ? '1px solid var(--gray-100)' : 'none',
                        cursor: 'pointer',
                        transition: 'background 200ms ease-out',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-50)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 8,
                          background: cfg.lightBg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <FileText size={17} color={cfg.accentHex} strokeWidth={2} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>
                            {s} — {year}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>
                            Official Board Paper · PDF
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                          padding: '3px 10px',
                          background: cfg.lightBg,
                          color: cfg.accentHex,
                          border: `1px solid ${cfg.accentHex}30`,
                          borderRadius: 9999,
                          fontSize: 11, fontWeight: 700,
                        }}>
                          {year}
                        </span>
                        <button
                          title="Download paper"
                          onClick={(e) => {
                            e.stopPropagation();
                            const filename = `${b.replace(/\s+/g, '_')}_Class_${c}_${s.replace(/\s+/g, '_')}_Board_Paper_${year}.pdf`;
                            const link = document.createElement('a');
                            link.href = '/sample-paper.pdf';
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          style={{
                            width: 34, height: 34,
                            borderRadius: '50%',
                            background: 'var(--gray-100)',
                            border: '1px solid var(--gray-200)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            color: cfg.accentHex,
                            transition: 'all 200ms ease-out',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = cfg.accentHex;
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = cfg.accentHex;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'var(--gray-100)';
                            e.currentTarget.style.color = cfg.accentHex;
                            e.currentTarget.style.borderColor = 'var(--gray-200)';
                          }}
                        >
                          <Download size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer link */}
                <div style={{
                  padding: '12px 24px',
                  borderTop: '1px solid var(--gray-100)',
                  textAlign: 'center',
                }}>
                  <button style={{
                    fontSize: 13, fontWeight: 600,
                    color: cfg.accentHex, background: 'none',
                    border: 'none', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    View All Papers
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Upload card */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4, fontFamily: 'var(--font-display)' }}>
                  Upload Your Papers
                </div>
                <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 14, lineHeight: 1.6 }}>
                  Have extra coaching papers? Upload them to boost prediction accuracy.
                </p>
                <div
                  className={`upload-zone${dragOver ? ' drag-over' : ''}`}
                  style={{ padding: 24 }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 4 }}>
                    Drop PDF here or click to upload
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>Supports PDF up to 50 MB</div>
                </div>
              </div>
            </div>

            {/* RIGHT — Study Resources + Predict */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Study Resources */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--gray-200)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <BookOpen size={16} color={cfg.accentHex} strokeWidth={2} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>
                      Study Resources
                    </span>
                  </div>
                </div>
                <div className="resources-list" style={{ padding: '4px 20px 8px' }}>
                  {[
                    { icon: '📋', name: 'Syllabus', desc: 'View complete exam syllabus', avail: syllabusOk },
                    { icon: '📖', name: 'Textbook', desc: 'Recommended NCERT textbook', avail: textbookOk },
                  ].map((r, i) => (
                    <div
                      key={r.name}
                      className="resources-item"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 0',
                        borderBottom: i === 0 ? '1px solid var(--gray-100)' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 8,
                          background: cfg.lightBg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 18,
                        }}>
                          {r.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-900)' }}>{r.name}</div>
                          <div className="resources-item-desc" style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>{r.desc}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          padding: '3px 9px',
                          background: r.avail ? 'var(--success-light)' : 'var(--danger-light)',
                          color: r.avail ? 'var(--success)' : 'var(--danger)',
                          borderRadius: 9999,
                          fontSize: 11, fontWeight: 700,
                        }}>
                          {r.avail ? 'Yes' : 'No'}
                        </span>
                        <ChevronRight className="resources-item-chevron" size={14} color="var(--gray-300)" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Predict Next Paper card */}
              <div className="card" style={{ padding: 0, overflow: 'hidden', border: `1px solid ${cfg.accentHex}25` }}>
                {/* Card header with gradient accent top */}
                <div style={{ height: 4, background: cfg.gradient }} />
                <div style={{ padding: '20px 20px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: cfg.lightBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Sparkles size={20} color={cfg.accentHex} strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>
                        AI Paper Predictor
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.6, marginTop: 3 }}>
                        Get AI-powered prediction for your next exam paper based on 5-year trends.
                      </div>
                    </div>
                  </div>

                  {/* Data readiness indicators */}
                  <div style={{
                    background: 'var(--gray-50)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    marginBottom: 16,
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                      Data Readiness
                    </div>
                    {[
                      { ok: papersAvail >= 3, label: `${papersAvail} papers available`, warn: papersAvail < 3 },
                      { ok: syllabusOk,        label: 'Syllabus available',             warn: false },
                      { ok: textbookOk,        label: 'Textbook available',             warn: false },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i < 2 ? 7 : 0 }}>
                        {item.ok
                          ? <CheckCircle size={14} color="var(--success)" strokeWidth={2.5} />
                          : <AlertTriangle size={14} color="var(--warning)" strokeWidth={2.5} />}
                        <span style={{ fontSize: 12, color: item.ok ? 'var(--gray-700)' : 'var(--warning)', fontWeight: 500 }}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                    <div style={{
                      marginTop: 10,
                      paddingTop: 10,
                      borderTop: '1px solid var(--gray-200)',
                      fontSize: 12,
                      fontWeight: 700,
                      color: qualityColor,
                    }}>
                      Prediction quality: {quality}
                    </div>
                  </div>

                  {error && (
                    <p style={{ color: 'var(--danger)', fontSize: 12, marginBottom: 12 }}>⚠ {error}</p>
                  )}
                </div>

                <div style={{ padding: '0 20px 20px' }}>
                  <div className="predict-btn-container">
                    <button
                      id="predict-next-btn"
                      onClick={handlePredict}
                      disabled={loading}
                      style={{
                        width: '100%',
                        height: 44,
                        background: loading ? '#9CA3AF' : cfg.gradient,
                        color: 'white',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        marginBottom: 10,
                        boxShadow: loading ? 'none' : '0 4px 16px rgba(0,0,0,0.18)',
                        transition: 'all 200ms ease-out',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {loading ? (
                        <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating…</>
                      ) : (
                        <><Sparkles size={16} strokeWidth={2.5} /> Predict Next Paper</>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => router.push('/predict/demo/overview')}
                    style={{
                      width: '100%', height: 36,
                      border: '1px solid var(--gray-200)',
                      borderRadius: 8,
                      background: 'white',
                      fontSize: 13, fontWeight: 600,
                      color: 'var(--gray-500)',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontFamily: 'var(--font-sans)',
                      transition: 'all 200ms ease-out',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.accentHex; e.currentTarget.style.color = cfg.accentHex; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-500)'; }}
                  >
                    See Sample Prediction
                  </button>

                  <p style={{ fontSize: 11, color: 'var(--gray-500)', textAlign: 'center', marginTop: 10 }}>
                    First 5 questions free · Full paper ₹99
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEO CONTENT SECTION ──────────────────────────────── */}
        <section style={{ borderTop: '1px solid var(--gray-200)', background: 'white', padding: '48px 0' }}>
          <div className="container" style={{ padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48 }}>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22, fontWeight: 800,
                  color: 'var(--gray-900)',
                  letterSpacing: '-0.02em',
                  marginBottom: 14,
                }}>
                  {seo.title}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.85, marginBottom: 20 }}>
                  {seo.body}
                </p>

                {/* Related subjects */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    Students also predict:
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {rel.map(rel => (
                      <button
                        key={rel}
                        onClick={() => router.push(`/subject/${encodeURIComponent(b)}/${encodeURIComponent(c)}/${encodeURIComponent(rel)}`)}
                        style={{
                          padding: '6px 16px',
                          border: '1px solid var(--gray-200)',
                          borderRadius: 9999,
                          fontSize: 13, fontWeight: 600,
                          color: 'var(--gray-700)',
                          background: 'white',
                          cursor: 'pointer',
                          transition: 'all 200ms ease-out',
                          fontFamily: 'var(--font-sans)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = cfg.accentHex;
                          e.currentTarget.style.color = cfg.accentHex;
                          e.currentTarget.style.background = cfg.lightBg;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--gray-200)';
                          e.currentTarget.style.color = 'var(--gray-700)';
                          e.currentTarget.style.background = 'white';
                        }}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right info box */}
              <div style={{
                background: cfg.lightBg,
                border: `1px solid ${cfg.accentHex}25`,
                borderRadius: 16,
                padding: 24,
                alignSelf: 'start',
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: cfg.accentHex, marginBottom: 16, fontFamily: 'var(--font-display)' }}>
                  How Prediction Works
                </div>
                {[
                  { step: '1', text: 'AI analyzes 5 years of past papers' },
                  { step: '2', text: 'Maps chapter frequency & trends' },
                  { step: '3', text: 'Calculates topic probability scores' },
                  { step: '4', text: 'Generates predicted question paper' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 22, height: 22,
                      borderRadius: '50%',
                      background: cfg.accentHex,
                      color: 'white',
                      fontSize: 11, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: 1,
                    }}>
                      {item.step}
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
