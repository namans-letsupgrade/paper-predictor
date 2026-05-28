'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ArrowLeft, FileText, BarChart2, TrendingUp, BookOpen,
  Star, Lock, RefreshCw, Download, Eye, Crown,
  CheckCircle, Info, ChevronRight, Sparkles,
  ListChecks, KeyRound, Home, AlertTriangle,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

interface Params { id: string }

/* ── Chart colour palette ──────────────────────────────── */
const CHART_COLORS = [
  '#1B4FD8','#7C3AED','#059669','#D97706',
  '#DC2626','#0891B2','#9333EA','#EA580C',
];

/* ── Mock analytics data ────────────────────────────────── */
const CHAPTER_DATA = [
  { name: 'Quadratic Equations',    value: 22 },
  { name: 'Arithmetic Progressions',value: 18 },
  { name: 'Triangles',              value: 16 },
  { name: 'Coordinate Geometry',    value: 14 },
  { name: 'Circles',                value: 12 },
  { name: 'Surface Areas',          value:  8 },
  { name: 'Statistics',             value:  6 },
  { name: 'Probability',            value:  4 },
];

const UNIT_DATA = [
  { name: 'Quadratic Equations', value: 22 },
  { name: 'Arithmetic Prog.',    value: 18 },
  { name: 'Triangles',           value: 16 },
  { name: 'Linear Equations',    value: 14 },
  { name: 'Circles',             value: 12 },
];

const QTYPE_DATA = [
  { name: 'MCQ (1 Mark)',            value: 20 },
  { name: 'Short Answer (2M)',       value: 30 },
  { name: 'Long Answer (3/5M)',      value: 35 },
  { name: 'Case Study (4/5M)',       value: 15 },
];

const IMPORTANT_TOPICS = [
  { topic: 'Quadratic Equations (Roots)',       chapter: 'Quadratic Equations',    prob: 95, why: 'Asked in 4 out of last 5 papers' },
  { topic: 'Pair of Linear Equations',          chapter: 'Linear Equations',       prob: 90, why: 'Repeated in all 5 past papers' },
  { topic: 'Arithmetic Progressions (nth Term)',chapter: 'Arithmetic Progressions',prob: 85, why: 'High-frequency question every year' },
  { topic: 'Triangles – Similarity Criteria',   chapter: 'Triangles',              prob: 80, why: 'High weightage theorem topic' },
  { topic: 'Probability – Basic Problems',      chapter: 'Probability',            prob: 75, why: 'Appears regularly in Section A' },
];

const TREND_CARDS = [
  {
    icon: '↑',
    label: 'Increasing Trend',
    badge: 'Rising',
    badgeColor: '#15803D', badgeBg: '#DCFCE7',
    items: ['Coordinate Geometry', 'Probability', 'Case Study Questions'],
    borderColor: '#BBF7D0', bgColor: '#F0FDF4',
  },
  {
    icon: '↓',
    label: 'Decreasing Trend',
    badge: 'Falling',
    badgeColor: '#B91C1C', badgeBg: '#FEE2E2',
    items: ['Mensuration (Surface Areas)', 'Constructions'],
    borderColor: '#FECACA', bgColor: '#FFF5F5',
  },
  {
    icon: '↔',
    label: 'Consistent Topics',
    badge: 'Stable',
    badgeColor: '#1440B0', badgeBg: '#DBEAFE',
    items: ['Quadratic Equations', 'Arithmetic Progressions', 'Triangles'],
    borderColor: '#BFDBFE', bgColor: '#EFF6FF',
  },
  {
    icon: '⭐',
    label: 'New Pattern',
    badge: 'New',
    badgeColor: '#6D28D9', badgeBg: '#EDE9FE',
    items: ['More Case Study Questions', 'Application-Based Problems'],
    borderColor: '#DDD6FE', bgColor: '#FAF5FF',
  },
];

/* ── Sidebar nav items ─────────────────────────────────── */
const NAV_ITEMS = [
  { icon: Home,       label: 'Overview',         key: 'overview',  soon: false },
  { icon: FileText,   label: 'Predicted Paper',  key: 'paper',     soon: false },
];

/* ── Custom donut label ─────────────────────────────────── */
function DonutCenter({ cx, cy, label }: { cx?: number; cy?: number; label: string }) {
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-6" fontSize={22} fontWeight={800} fill="#111827" fontFamily="Bricolage Grotesque, Inter, sans-serif">
        {label}
      </tspan>
      <tspan x={cx} dy="18" fontSize={11} fill="#6B7280" fontFamily="Inter, sans-serif">
        Topics
      </tspan>
    </text>
  );
}

/* ── Probability badge ─────────────────────────────────── */
function ProbBadge({ prob }: { prob: number }) {
  const color = prob >= 85 ? '#15803D' : prob >= 75 ? '#1440B0' : '#D97706';
  const bg    = prob >= 85 ? '#DCFCE7' : prob >= 75 ? '#DBEAFE' : '#FEF3C7';
  const border= prob >= 85 ? '#BBF7D0' : prob >= 75 ? '#BFDBFE' : '#FDE68A';
  return (
    <span style={{
      padding: '4px 11px',
      background: bg, color, border: `1px solid ${border}`,
      borderRadius: 9999, fontSize: 12, fontWeight: 700,
    }}>
      {prob}%
    </span>
  );
}

/* ── Main component ─────────────────────────────────────── */
export default function PredictOverviewPage({ params }: { params: Promise<Params> }) {
  const { id }   = use(params);
  const router   = useRouter();
  const [activeNav, setActiveNav] = useState('overview');
  const [isPaid, setIsPaid]       = useState(false);
  const ringRef  = useRef<SVGCircleElement>(null);

  const confidenceScore = 81;
  const circumference   = 2 * Math.PI * 54; // r=54

  useEffect(() => {
    if (ringRef.current) {
      setTimeout(() => {
        if (ringRef.current) {
          ringRef.current.style.strokeDashoffset = String(
            circumference - (confidenceScore / 100) * circumference
          );
        }
      }, 400);
    }
  }, [circumference]);

  const isDemo = id === 'demo';

  /* ── RENDER ─────────────────────────────────────────────── */
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--gray-50)' }}>
        <div style={{ display: 'flex' }}>

          {/* ── SIDEBAR ──────────────────────────────────────── */}
          <aside style={{
            width: 240,
            flexShrink: 0,
            background: 'white',
            borderRight: '1px solid var(--gray-200)',
            position: 'sticky',
            top: 64,
            height: 'calc(100vh - 64px)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Back link */}
            <div style={{ padding: '20px 16px 12px' }}>
              <button
                onClick={() => router.back()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 600, color: 'var(--gray-500)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'color 200ms ease-out',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}
              >
                <ArrowLeft size={14} strokeWidth={2.5} />
                Back to Subject
              </button>
            </div>

            <div style={{ height: 1, background: 'var(--gray-100)', margin: '0 16px' }} />

            {/* Nav items */}
            <nav style={{ padding: '12px 10px', flex: 1 }}>
              {NAV_ITEMS.map(item => {
                const Icon     = item.icon;
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (!item.soon) {
                        setActiveNav(item.key);
                        if (item.key === 'paper') router.push(`/predict/${id}/paper`);
                        else if (item.key === 'overview') setActiveNav('overview');
                      }
                    }}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px',
                      borderRadius: 8,
                      background: isActive ? 'var(--brand-primary-light)' : 'transparent',
                      border: 'none',
                      cursor: item.soon ? 'default' : 'pointer',
                      marginBottom: 2,
                      textAlign: 'left',
                      transition: 'background 200ms ease-out',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseEnter={e => { if (!isActive && !item.soon) e.currentTarget.style.background = 'var(--gray-50)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Icon
                      size={15}
                      strokeWidth={2}
                      color={isActive ? 'var(--brand-primary)' : 'var(--gray-500)'}
                    />
                    <span style={{
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--brand-primary)' : 'var(--gray-700)',
                      flex: 1,
                    }}>
                      {item.label}
                    </span>
                    {item.soon && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
                        padding: '2px 6px', borderRadius: 9999,
                        background: '#FEF3C7', color: '#B45309',
                        border: '1px solid #FDE68A',
                      }}>
                        SOON
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Premium upsell card */}
            <div style={{ padding: '12px 16px 20px' }}>
              <div style={{
                background: 'linear-gradient(135deg,#1B4FD8 0%,#4F46E5 100%)',
                borderRadius: 14,
                padding: '18px 16px',
                boxShadow: '0 4px 20px rgba(27,79,216,0.25)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Crown size={18} color="#FCD34D" strokeWidth={2} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>
                    Unlock Premium
                  </span>
                </div>
                {[
                  'Unlimited Predictions',
                  'Detailed Answer Key',
                  'Chapter-wise Plans',
                  'Topic Priority List',
                  'Performance Insights',
                ].map(feat => (
                  <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                    <CheckCircle size={12} color="rgba(255,255,255,0.85)" strokeWidth={2.5} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{feat}</span>
                  </div>
                ))}
                <button
                  onClick={() => setIsPaid(true)}
                  style={{
                    width: '100%', height: 36, marginTop: 14,
                    background: 'white', color: 'var(--brand-primary)',
                    border: 'none', borderRadius: 8,
                    fontSize: 13, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'var(--font-sans)',
                    transition: 'opacity 200ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ──────────────────────────────────── */}
          <div className="predict-main-content" style={{ flex: 1, minWidth: 0, padding: '28px 32px', overflowX: 'hidden' }}>

            {/* Mobile Horizontal Tabs */}
            <div className="mobile-tabs-container">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (!item.soon) {
                        setActiveNav(item.key);
                        if (item.key === 'paper') router.push(`/predict/${id}/paper`);
                        else if (item.key === 'overview') setActiveNav('overview');
                      }
                    }}
                    className={`mobile-tab-btn${isActive ? ' active' : ''}`}
                    disabled={item.soon}
                  >
                    <Icon size={14} strokeWidth={2} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── HEADER ── */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <Link href="/" style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>Home</Link>
                    <ChevronRight size={12} color="var(--gray-400)" />
                    <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>CBSE · Class 10</span>
                    <ChevronRight size={12} color="var(--gray-400)" />
                    <span style={{ fontSize: 12, color: 'var(--brand-primary)', fontWeight: 600 }}>Mathematics Prediction</span>
                  </div>
                  <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(20px,2.5vw,28px)',
                    fontWeight: 900,
                    color: 'var(--gray-900)',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.2,
                    marginBottom: 6,
                  }}>
                    Mathematics —{' '}
                    <span style={{ color: 'var(--brand-primary)' }}>Prediction Overview</span>
                  </h1>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                    AI predicted paper based on analysis of 5 previous year papers, syllabus &amp; textbook.
                  </p>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <button
                    onClick={() => router.push(`/predict/${id}/paper`)}
                    className="btn btn-primary"
                    style={{ height: 40, fontSize: 13, gap: 6, borderRadius: 8 }}
                  >
                    <Eye size={14} strokeWidth={2.5} />
                    View Predicted Paper
                  </button>
                  <button
                    className="btn btn-outline"
                    disabled={!isPaid}
                    style={{ height: 40, fontSize: 13, gap: 6, opacity: isPaid ? 1 : 0.6 }}
                  >
                    <Download size={14} strokeWidth={2.5} />
                    Download PDF {!isPaid && <Lock size={12} />}
                  </button>
                  <button
                    className="btn btn-outline"
                    disabled={!isPaid}
                    style={{ height: 40, fontSize: 13, gap: 6, opacity: isPaid ? 1 : 0.6 }}
                  >
                    <RefreshCw size={14} strokeWidth={2.5} />
                    Regenerate {!isPaid && <Lock size={12} />}
                  </button>
                </div>
              </div>

              {/* Metadata strip */}
              <div style={{
                display: 'flex', gap: 0, flexWrap: 'wrap',
                background: 'white',
                border: '1px solid var(--gray-200)',
                borderRadius: 10,
                overflow: 'hidden',
                marginTop: 20,
              }}>
                {[
                  { label: 'Board',                value: 'CBSE' },
                  { label: 'Class',                value: '10' },
                  { label: 'Subject',              value: 'Mathematics' },
                  { label: 'Based On',             value: '5 Papers + Syllabus' },
                  { label: 'Prediction Confidence',value: '81% HIGH', highlight: true },
                  { label: 'Generated On',         value: '27 May 2025' },
                ].map((m, i, arr) => (
                  <div
                    key={m.label}
                    style={{
                      padding: '12px 18px',
                      borderRight: i < arr.length - 1 ? '1px solid var(--gray-200)' : 'none',
                      minWidth: 0,
                    }}
                  >
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 3 }}>
                      {m.label}
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: m.highlight ? 'var(--success)' : 'var(--gray-900)',
                      whiteSpace: 'nowrap',
                    }}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── THREE ANALYTICS CARDS ── */}
            <div className="analytics-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginBottom: 24 }}>

              {/* Card 1 — Chapter Weightage Donut */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>
                    Chapter Weightage
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 500 }}>Expected</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={CHAPTER_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={82}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="#F9FAFB"
                        labelLine={false}
                      >
                        {CHAPTER_DATA.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => [`${v}%`, 'Weightage']}
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--gray-200)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
                  {CHAPTER_DATA.slice(0, 4).map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: CHART_COLORS[i], flexShrink: 0 }} />
                        <span style={{ color: 'var(--gray-700)', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
                <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)' }}>
                  View All Chapters <ChevronRight size={12} />
                </button>
              </div>

              {/* Card 2 — Unit Weightage Bar */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>
                    Unit Weightage
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 500 }}>Top Units</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={UNIT_DATA}
                    layout="vertical"
                    margin={{ top: 0, right: 24, left: 4, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={false} stroke="#F3F4F6" />
                    <XAxis
                      type="number"
                      domain={[0, 28]}
                      tickFormatter={v => `${v}%`}
                      tick={{ fontSize: 10, fill: '#6B7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={90}
                      tick={{ fontSize: 10, fill: '#374151' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                        formatter={(v) => [`${v}%`, 'Weightage']}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--gray-200)' }}
                      cursor={{ fill: 'rgba(27,79,216,0.05)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {UNIT_DATA.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)' }}>
                  View All Units <ChevronRight size={12} />
                </button>
              </div>

              {/* Card 3 — Question Types Donut */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>
                    Question Types
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 500 }}>Distribution</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={QTYPE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={82}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="#F9FAFB"
                      >
                        {QTYPE_DATA.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => [`${v}%`, 'Distribution']}
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--gray-200)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
                  {QTYPE_DATA.map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: CHART_COLORS[i], flexShrink: 0 }} />
                        <span style={{ color: 'var(--gray-700)' }}>{d.name}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
                <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)' }}>
                  View Question Types <ChevronRight size={12} />
                </button>
              </div>
            </div>

            {/* ── TWO-COLUMN: TOPICS TABLE + TREND INSIGHTS ── */}
            <div className="predict-layout-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 20, marginBottom: 24 }}>

              {/* Important Topics Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Table header */}
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--gray-200)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Star size={16} color="var(--brand-primary)" strokeWidth={2} />
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>
                      Important Topics
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>High Probability</span>
                    <span title="Topics most likely to appear in your exam based on pattern analysis" style={{ cursor: 'help', lineHeight: 0 }}>
                      <Info size={13} color="var(--gray-400)" strokeWidth={2} />
                    </span>
                  </div>
                </div>

                <div className="mobile-table-scroll" style={{ overflowX: 'auto' }}>
                  <div style={{ minWidth: 580 }}>
                    {/* Column headers */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '2fr 1.4fr 90px 1fr',
                      padding: '10px 20px',
                      background: 'var(--gray-50)',
                      borderBottom: '1px solid var(--gray-100)',
                    }}>
                      {['Topic', 'Chapter / Unit', 'Probability', 'Why Important?'].map(h => (
                        <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {h}
                        </div>
                      ))}
                    </div>

                    {/* Rows */}
                    <div style={{ position: 'relative' }}>
                      {IMPORTANT_TOPICS.map((t, i) => {
                        const isLocked = !isPaid && i >= 3;
                        return (
                          <div
                            key={t.topic}
                            style={{
                              display: 'grid', gridTemplateColumns: '2fr 1.4fr 90px 1fr',
                              padding: '13px 20px',
                              borderBottom: i < IMPORTANT_TOPICS.length - 1 ? '1px solid var(--gray-100)' : 'none',
                              filter: isLocked ? 'blur(4px)' : 'none',
                              userSelect: isLocked ? 'none' : 'auto',
                              pointerEvents: isLocked ? 'none' : 'auto',
                              transition: 'background 200ms ease-out',
                            }}
                            onMouseEnter={e => { if (!isLocked) e.currentTarget.style.background = 'var(--gray-50)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)', paddingRight: 8 }}>{t.topic}</div>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)', paddingRight: 8 }}>{t.chapter}</div>
                            <div><ProbBadge prob={t.prob} /></div>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5 }}>{t.why}</div>
                          </div>
                        );
                      })}

                      {/* Paywall overlay */}
                      {!isPaid && (
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          height: 110,
                          background: 'linear-gradient(to bottom,rgba(249,250,251,0) 0%,rgba(249,250,251,0.95) 40%)',
                          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                          paddingBottom: 16,
                        }}>
                          <button
                            onClick={() => setIsPaid(true)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              padding: '10px 20px',
                              background: 'var(--brand-primary)',
                              color: 'white',
                              border: 'none',
                              borderRadius: 9,
                              fontSize: 13, fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 4px 16px rgba(27,79,216,0.28)',
                              fontFamily: 'var(--font-sans)',
                            }}
                          >
                            <Lock size={13} strokeWidth={2.5} />
                            Unlock All Topics
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--gray-100)' }}>
                  <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)' }}>
                    View All Important Topics <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Past Trend Insights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{
                    padding: '16px 18px',
                    borderBottom: '1px solid var(--gray-200)',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <TrendingUp size={15} color="var(--brand-primary)" strokeWidth={2} />
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>
                      Past Trend Insights
                    </span>
                    <Info size={13} color="var(--gray-400)" strokeWidth={2} />
                  </div>

                  <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {TREND_CARDS.map(tc => (
                      <div
                        key={tc.label}
                        style={{
                          background: tc.bgColor,
                          border: `1px solid ${tc.borderColor}`,
                          borderRadius: 10,
                          padding: '12px 14px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 16 }}>{tc.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{tc.label}</span>
                          <span style={{
                            padding: '2px 8px',
                            background: tc.badgeBg, color: tc.badgeColor,
                            borderRadius: 9999,
                            fontSize: 10, fontWeight: 700, marginLeft: 'auto',
                          }}>
                            {tc.badge}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {tc.items.map(item => (
                            <span
                              key={item}
                              style={{
                                padding: '3px 9px',
                                background: 'rgba(255,255,255,0.70)',
                                borderRadius: 9999,
                                fontSize: 11, fontWeight: 600,
                                color: '#374151',
                                border: '1px solid rgba(0,0,0,0.07)',
                              }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: '10px 18px', borderTop: '1px solid var(--gray-100)' }}>
                    <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)' }}>
                      View Detailed Trend Analysis <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── AI INSIGHT BANNER ── */}
            <div style={{
              background: 'linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 100%)',
              border: '1px solid #C7D2FE',
              borderRadius: 14,
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: 'var(--brand-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(27,79,216,0.25)',
                }}>
                  <Sparkles size={20} color="white" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-primary)', marginBottom: 4 }}>
                    💡 AI Insight
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.6, margin: 0 }}>
                    Focus more on <strong>Quadratic Equations, Triangles, and Arithmetic Progressions</strong> — these three chapters carry <strong>~46% of total marks</strong> every year. Don&apos;t skip Coordinate Geometry as it&apos;s showing an increasing trend.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/predict/${id}/paper`)}
                style={{
                  flexShrink: 0,
                  padding: '10px 18px',
                  background: 'var(--brand-primary)',
                  color: 'white', border: 'none',
                  borderRadius: 9, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  boxShadow: '0 4px 12px rgba(27,79,216,0.25)',
                  transition: 'all 200ms ease-out',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-primary-dark)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                View Predicted Paper →
              </button>
            </div>

          </div>{/* end main */}
        </div>
      </main>
      <Footer />
    </>
  );
}
