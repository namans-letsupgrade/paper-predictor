'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ArrowLeft, Download, Printer, Share2, RefreshCw,
  Lock, Crown, CheckCircle, X, ChevronRight, ChevronDown,
  FileText, BarChart2, TrendingUp, Star, KeyRound,
  Home, ListChecks, Sparkles, BookOpen, Eye,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Params { id: string }

/* ── Chart colours ─────────────────────────────────────── */
const CC = ['#1B4FD8','#7C3AED','#059669','#D97706','#DC2626','#0891B2','#9333EA','#EA580C'];

const CHAPTER_DATA = [
  { name: 'Quadratic Equations',    value: 22 },
  { name: 'Arithmetic Progressions',value: 18 },
  { name: 'Triangles',              value: 16 },
  { name: 'Coordinate Geometry',    value: 14 },
  { name: 'Circles',                value: 12 },
  { name: 'Others',                 value: 18 },
];
const QTYPE_DATA = [
  { name: 'MCQ (1 Mark)',       value: 20 },
  { name: 'Short Ans (2M)',     value: 30 },
  { name: 'Long Ans (3/5M)',    value: 35 },
  { name: 'Case Study (4/5M)', value: 15 },
];

/* ── Sidebar nav ────────────────────────────────────────── */
const NAV_ITEMS = [
  { icon: Home,       label: 'Overview',         key: 'overview', soon: false },
  { icon: FileText,   label: 'Predicted Paper',  key: 'paper',    soon: false },
];

/* ── Paper summary stats ─────────────────────────────────── */
const PAPER_STATS = [
  { label: 'Total Questions', value: '32',  color: 'var(--brand-primary)' },
  { label: 'Total Marks',     value: '80',  color: 'var(--gray-900)' },
];
const SECTION_STATS = [
  { label: 'MCQ (1 Mark)',         q: 20, marks: 20 },
  { label: 'Short Answer (2 Marks)', q:  6, marks: 12 },
  { label: 'Long Answer (3/5 Marks)',q:  4, marks: 20 },
  { label: 'Case Study (4/5 Marks)',q:  2, marks: 16 },
];

/* ── Mock question data ─────────────────────────────────── */
interface MCQQuestion {
  id: number;
  text: string;
  options: string[];
  chapter: string;
  prob: 'Very High' | 'High' | 'Medium';
  marks: number;
}
interface SAQuestion {
  id: number;
  text: string;
  chapter: string;
  prob: 'Very High' | 'High' | 'Medium';
  marks: number;
}

const SECTION_A: MCQQuestion[] = [
  {
    id: 1,
    text: 'If the sum of zeroes of the polynomial p(x) = kx² + 2x + 3k is equal to their product, then k =',
    options: ['(A)  1/3', '(B)  −1/3', '(C)  2/3', '(D)  −2/3'],
    chapter: 'Polynomials', prob: 'High', marks: 1,
  },
  {
    id: 2,
    text: 'The discriminant of the quadratic equation 2x² − 4x + 3 = 0 is:',
    options: ['(A)  −8', '(B)  8', '(C)  40', '(D)  −40'],
    chapter: 'Quadratic Equations', prob: 'Very High', marks: 1,
  },
  {
    id: 3,
    text: 'In △ABC, if DE ∥ BC, AD = 3 cm, DB = 5 cm and AE = 4.5 cm, then EC =',
    options: ['(A)  6 cm', '(B)  7 cm', '(C)  7.5 cm', '(D)  8 cm'],
    chapter: 'Triangles', prob: 'Very High', marks: 1,
  },
  // Hidden behind paywall — shown as ghost rows
  { id: 4, text: 'The 12th term of the AP: 4, 9, 14, … is:', options: ['(A)  54','(B)  59','(C)  64','(D)  69'], chapter: 'Arithmetic Progressions', prob: 'High', marks: 1 },
  { id: 5, text: 'Distance between the points A(2, 3) and B(4, 1) is:', options: ['(A)  2√2','(B)  2√3','(C)  4','(D)  √8'], chapter: 'Coordinate Geometry', prob: 'High', marks: 1 },
  { id: 6, text: 'sin²60° + cos²30° − tan²45° =', options: ['(A)  0','(B)  1','(C)  1/2','(D)  3/2'], chapter: 'Trigonometry', prob: 'Very High', marks: 1 },
];

const SECTION_B: SAQuestion[] = [
  { id: 21, text: 'Find the zeroes of the polynomial p(x) = x² − 3x − 10 and verify the relationship between zeroes and coefficients.', chapter: 'Polynomials', prob: 'High', marks: 2 },
  { id: 22, text: 'The 4th term of an AP is 11 and the 8th term exceeds twice the 4th term by 5. Find the sum of its first 10 terms.', chapter: 'Arithmetic Progressions', prob: 'Very High', marks: 2 },
  { id: 23, text: 'In the given figure, if PQ ∥ RS, prove that △POQ ~ △SOR.', chapter: 'Triangles', prob: 'High', marks: 2 },
  { id: 24, text: 'Find the coordinates of the point which divides the line segment joining A(−1, 7) and B(4, −3) in the ratio 2:3.', chapter: 'Coordinate Geometry', prob: 'Medium', marks: 2 },
];

const SECTION_C_PREVIEW = [
  { id: 31, label: 'Prove that √3 is irrational.', marks: 3, chapter: 'Real Numbers' },
  { id: 32, label: 'Solve: 2x + 3y = 11, 2x − 4y = −24. Find the value of m if y = mx + 3.', marks: 3, chapter: 'Linear Equations' },
];
const SECTION_D_PREVIEW = [
  { id: 35, label: 'A train travels 360 km at a uniform speed. If the speed had been 5 km/h more it would have taken 1 hour less. Find the speed.', marks: 5, chapter: 'Quadratic Equations' },
];
const SECTION_E_PREVIEW = [
  { id: 39, label: 'Case Study: The school building casts a shadow. Two students standing near it observe angles of elevation. Based on this scenario, answer the following...', marks: 4, chapter: 'Trigonometry' },
];

/* ── Prob badge ─────────────────────────────────────────── */
function ProbChip({ prob }: { prob: string }) {
  const cfg =
    prob === 'Very High' ? { bg: '#DCFCE7', color: '#15803D', border: '#BBF7D0', dot: '🔥' } :
    prob === 'High'      ? { bg: '#DBEAFE', color: '#1440B0', border: '#BFDBFE', dot: '⚡' } :
                           { bg: '#FEF3C7', color: '#B45309', border: '#FDE68A', dot: '•' };
  return (
    <span style={{ padding:'2px 9px', borderRadius:9999, fontSize:11, fontWeight:700, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>
      {cfg.dot} {prob}
    </span>
  );
}

/* ── Section header banner ──────────────────────────────── */
function SectionHeader({ label, type, instruction, marksEq, color = 'linear-gradient(135deg,#1B4FD8 0%,#1440B0 100%)' }: {
  label: string; type: string; instruction: string; marksEq: string; color?: string;
}) {
  return (
    <div style={{
      background: color, borderRadius: 10, padding: '14px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 12,
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
          {label}  <span style={{ fontWeight: 400, fontSize: 12, opacity: 0.75 }}>({type})</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>{instruction}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'white', fontFamily: 'var(--font-display)' }}>{marksEq}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>Marks</div>
      </div>
    </div>
  );
}

/* ── MCQ question card ──────────────────────────────────── */
function MCQCard({ q, locked = false }: { q: MCQQuestion; locked?: boolean }) {
  return (
    <div style={{
      background: 'white', border: '1px solid var(--gray-200)', borderRadius: 10,
      padding: '16px 18px', marginBottom: 10,
      filter: locked ? 'blur(3px)' : 'none',
      userSelect: locked ? 'none' : 'auto',
      transition: 'box-shadow 200ms ease-out, border-color 200ms ease-out',
    }}
    onMouseEnter={e => { if (!locked) { e.currentTarget.style.boxShadow = '0 2px 12px rgba(27,79,216,0.10)'; e.currentTarget.style.borderColor = 'var(--gray-300)'; } }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Q number */}
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: 'var(--brand-primary-light)',
          color: 'var(--brand-primary)',
          fontSize: 12, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 1,
        }}>
          {q.id}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--gray-900)', margin: '0 0 14px' }}>
            {q.text}
          </p>
          {/* Options — 2×2 grid */}
          <div className="mcq-options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', marginBottom: 14 }}>
            {q.options.map((opt, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 10px', borderRadius: 7,
                border: '1px solid var(--gray-200)',
                fontSize: 13, color: 'var(--gray-700)',
                background: 'var(--gray-50)',
                cursor: 'pointer',
                transition: 'all 200ms ease-out',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-primary-light)'; e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.color = 'var(--brand-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-700)'; }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: '50%',
                  border: '1.5px solid var(--gray-300)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: 'var(--gray-500)',
                  flexShrink: 0, background: 'white',
                }}>
                  {opt[1]}
                </span>
                <span>{opt.slice(4)}</span>
              </div>
            ))}
          </div>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ padding:'2px 9px', borderRadius:9999, fontSize:11, fontWeight:600, background:'var(--brand-primary-light)', color:'var(--brand-primary)', border:'1px solid #BFDBFE' }}>
              📚 {q.chapter}
            </span>
            <ProbChip prob={q.prob} />
            <span style={{ padding:'2px 9px', borderRadius:9999, fontSize:11, fontWeight:600, background:'var(--gray-100)', color:'var(--gray-700)', border:'1px solid var(--gray-200)' }}>
              {q.marks} Mark
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Short answer card ──────────────────────────────────── */
function SACard({ q, locked = false }: { q: SAQuestion; locked?: boolean }) {
  return (
    <div style={{
      background: 'white', border: '1px solid var(--gray-200)', borderRadius: 10,
      padding: '16px 18px', marginBottom: 10,
      filter: locked ? 'blur(3px)' : 'none',
      userSelect: locked ? 'none' : 'auto',
      transition: 'box-shadow 200ms ease-out',
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: '#EDE9FE', color: '#6D28D9',
          fontSize: 12, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 1,
        }}>
          {q.id}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--gray-900)', margin: '0 0 12px' }}>
            {q.text}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ padding:'2px 9px', borderRadius:9999, fontSize:11, fontWeight:600, background:'#EDE9FE', color:'#6D28D9', border:'1px solid #DDD6FE' }}>
              📚 {q.chapter}
            </span>
            <ProbChip prob={q.prob} />
            <span style={{ padding:'2px 9px', borderRadius:9999, fontSize:11, fontWeight:600, background:'#EDE9FE', color:'#6D28D9', border:'1px solid #DDD6FE' }}>
              {q.marks} Marks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Locked section placeholder ─────────────────────────── */
function LockedSection({ count, label }: { count: number; label: string }) {
  return (
    <div style={{
      background: 'repeating-linear-gradient(45deg,#F9FAFB,#F9FAFB 10px,#F3F4F6 10px,#F3F4F6 20px)',
      border: '1.5px dashed var(--gray-300)', borderRadius: 10,
      padding: '20px', marginBottom: 10,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <Lock size={16} color="var(--gray-400)" strokeWidth={2} />
      <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>
        {count} more {label} questions locked — <strong style={{ color: 'var(--brand-primary)' }}>Upgrade to view</strong>
      </span>
    </div>
  );
}

/* ── Expand / Paywall trigger button ─────────────────────── */
function ExpandBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', height: 40,
        border: '1.5px dashed var(--gray-300)', borderRadius: 10,
        background: 'var(--gray-50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontSize: 13, fontWeight: 700, color: 'var(--brand-primary)',
        cursor: 'pointer', marginTop: 8,
        fontFamily: 'var(--font-sans)',
        transition: 'all 200ms ease-out',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-primary-light)'; e.currentTarget.style.borderColor = 'var(--brand-primary)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.borderColor = 'var(--gray-300)'; }}
    >
      <Eye size={14} strokeWidth={2.5} />
      View Full Paper
      <ChevronDown size={14} strokeWidth={2.5} />
    </button>
  );
}

/* ── Paywall modal ──────────────────────────────────────── */
function PaywallModal({ onClose, onUnlock }: { onClose: () => void; onUnlock: () => void }) {
  const router = useRouter();
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(17, 24, 39, 0.70)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 24,
          padding: '32px 28px',
          maxWidth: 480, width: '100%',
          boxShadow: '0 24px 80px rgba(0,0,0,0.15)',
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        {/* Close btn */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 18, right: 18,
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--gray-100)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 200ms',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-200)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--gray-100)'}
        >
          <X size={15} color="var(--gray-700)" strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #FCD34D, #D97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(217,119,6,0.25)',
            marginBottom: 12,
          }}>
            <Crown size={28} color="white" fill="white" />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900,
            color: 'var(--gray-900)', letterSpacing: '-0.02em', marginBottom: 6,
          }}>
            Unlock Full Predicted Paper
          </h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, maxWidth: 360 }}>
            Get complete access to predicted paper, answer key, and more
          </p>
        </div>

        {/* What you unlock list */}
        <div style={{
          background: 'var(--gray-50)',
          borderRadius: 14,
          padding: '16px 18px',
          border: '1px solid var(--gray-200)',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)', marginBottom: 10 }}>
            What you unlock
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 14px' }}>
            {[
              'Full predicted paper (all 32 questions)',
              'Section-wise answers & solutions',
              'PDF download',
              '3 paper regenerations',
              'Chapter-wise preparation guide',
              'Important topic priority list',
            ].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: 13 }}>✓</span>
                <span style={{ fontSize: 12, color: 'var(--gray-700)', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          {/* Card A */}
          <div style={{
            border: '1.5px solid var(--gray-200)',
            borderRadius: 16,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            background: 'white',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 4 }}>Single Paper</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: 'var(--gray-900)' }}>₹99</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--gray-500)', lineHeight: 1.4, marginBottom: 14 }}>
                One-time unlock for Mathematics
              </p>
            </div>
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', marginBottom: 8 }}>Validity: 60 days</div>
              <button
                onClick={onUnlock}
                style={{
                  width: '100%', height: 36,
                  background: 'var(--brand-primary)', color: 'white',
                  borderRadius: 10, fontSize: 12, fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(27,79,216,0.2)',
                  transition: 'all 200ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-primary-dark)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--brand-primary)'}
              >
                Unlock for ₹99
              </button>
            </div>
          </div>

          {/* Card B */}
          <div style={{
            border: '1.5px solid var(--brand-accent)',
            borderRadius: 16,
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            background: 'var(--brand-primary-light)',
          }}>
            {/* Recommended Badge */}
            <div style={{
              position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              color: 'white', fontSize: 9, fontWeight: 800,
              padding: '2px 8px', borderRadius: 9999,
              boxShadow: '0 2px 6px rgba(217,119,6,0.2)',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              ⭐ Recommended
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-accent)', textTransform: 'uppercase', marginBottom: 4, marginTop: 2 }}>Pro Monthly</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2, marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: 'var(--gray-900)' }}>₹199</span>
                <span style={{ fontSize: 11, color: 'var(--gray-500)' }}>/mo</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--gray-600)', lineHeight: 1.4, marginBottom: 14 }}>
                All subjects, unlimited predictions
              </p>
            </div>
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8 }}>Validity: 30 days</div>
              <button
                onClick={() => {
                  onUnlock();
                  router.push('/pricing');
                }}
                style={{
                  width: '100%', height: 36,
                  border: '1.5px solid var(--brand-primary)',
                  background: 'transparent', color: 'var(--brand-primary)',
                  borderRadius: 10, fontSize: 12, fontWeight: 700,
                  transition: 'all 200ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-primary-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Try Pro for ₹199
              </button>
            </div>
          </div>
        </div>

        {/* Security and Social Proof */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>
            🔒 Secure payment via Razorpay. Instant access after payment.
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--success)' }}>
            ✓ 1,000+ students unlocked this paper this month
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar component ──────────────────────────────────── */
function Sidebar({ id, isPaid, setIsPaid, router }: {
  id: string; isPaid: boolean; setIsPaid: (v: boolean) => void; router: ReturnType<typeof useRouter>;
}) {
  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: 'white',
      borderRight: '1px solid var(--gray-200)',
      position: 'sticky', top: 64,
      height: 'calc(100vh - 64px)',
      overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Back link */}
      <div style={{ padding: '20px 16px 12px' }}>
        <button
          onClick={() => router.push(`/predict/${id}/overview`)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600, color: 'var(--gray-500)',
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', transition: 'color 200ms ease-out',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Back to Overview
        </button>
      </div>
      <div style={{ height: 1, background: 'var(--gray-100)', margin: '0 16px' }} />

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = item.key === 'paper';
          return (
            <button
              key={item.key}
              onClick={() => {
                if (!item.soon) {
                  if (item.key === 'overview') router.push(`/predict/${id}/overview`);
                }
              }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8,
                background: isActive ? 'var(--brand-primary-light)' : 'transparent',
                border: 'none', cursor: item.soon ? 'default' : 'pointer',
                marginBottom: 2, textAlign: 'left',
                transition: 'background 200ms ease-out',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={e => { if (!isActive && !item.soon) e.currentTarget.style.background = 'var(--gray-50)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={15} strokeWidth={2} color={isActive ? 'var(--brand-primary)' : 'var(--gray-500)'} />
              <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--brand-primary)' : 'var(--gray-700)', flex: 1 }}>
                {item.label}
              </span>
              {item.soon && (
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 9999, background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}>
                  SOON
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Premium upsell */}
      <div style={{ padding: '12px 16px 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg,#1B4FD8 0%,#4F46E5 100%)',
          borderRadius: 14, padding: '18px 16px',
          boxShadow: '0 4px 20px rgba(27,79,216,0.25)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Crown size={18} color="#FCD34D" strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)' }}>Unlock Premium</span>
          </div>
          {['All 32 Questions','Detailed Answer Key','Download PDF','Chapter-wise Plans','Performance Insights'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
              <CheckCircle size={12} color="rgba(255,255,255,0.85)" strokeWidth={2.5} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{f}</span>
            </div>
          ))}
          <button
            onClick={() => setIsPaid(true)}
            style={{
              width: '100%', height: 36, marginTop: 14,
              background: 'white', color: 'var(--brand-primary)',
              border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
export default function PredictedPaperPage({ params }: { params: Promise<Params> }) {
  const { id }    = use(params);
  const router    = useRouter();
  const [isPaid, setIsPaid]           = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeTab, setActiveTab]     = useState<'paper' | 'instructions'>('paper');
  const [viewMode, setViewMode]       = useState<'sections' | 'marks'>('sections');

  const triggerPaywall = () => {
    if (!isPaid) setShowPaywall(true);
  };
  const handleUnlock = () => {
    setIsPaid(true);
    setShowPaywall(false);
  };

  /* Free: show 3 MCQ, 2 SA; Paid: show all */
  const visibleMCQ = isPaid ? SECTION_A : SECTION_A.slice(0, 3);
  const hiddenMCQCount = SECTION_A.length - visibleMCQ.length;

  const visibleSA  = isPaid ? SECTION_B : SECTION_B.slice(0, 2);
  const hiddenSACount = SECTION_B.length - visibleSA.length;

  return (
    <>
      <Navbar />
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} onUnlock={handleUnlock} />}

      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--gray-50)' }}>
        <div style={{ display: 'flex' }}>
          <Sidebar id={id} isPaid={isPaid} setIsPaid={setIsPaid} router={router} />

          {/* ── MAIN CONTENT ────────────────────────────────── */}
          <div className="predict-main-content" style={{ flex: 1, minWidth: 0, padding: '24px 28px', overflowX: 'hidden' }}>

            {/* Mobile Horizontal Tabs */}
            <div className="mobile-tabs-container">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = item.key === 'paper';
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (!item.soon) {
                        if (item.key === 'overview') router.push(`/predict/${id}/overview`);
                        else if (item.key === 'paper') {}
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

            {/* ── PAPER HEADER ── */}
            <div style={{ marginBottom: 20 }}>
              {/* Back + title row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                <div>
                  <button
                    onClick={() => router.push(`/predict/${id}/overview`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      fontSize: 12, color: 'var(--gray-500)', fontWeight: 600,
                      background: 'none', border: 'none', cursor: 'pointer',
                      marginBottom: 10, fontFamily: 'var(--font-sans)',
                      transition: 'color 200ms ease-out',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-500)')}
                  >
                    <ArrowLeft size={13} strokeWidth={2.5} />
                    Back to Predictions
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <h1 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(18px,2.2vw,24px)',
                      fontWeight: 900, color: 'var(--gray-900)',
                      letterSpacing: '-0.025em',
                    }}>
                      Mathematics — <span style={{ color: 'var(--brand-primary)' }}>Predicted Paper</span>
                    </h1>
                    <span style={{
                      padding: '4px 12px', borderRadius: 9999,
                      background: 'var(--brand-primary-light)', color: 'var(--brand-primary)',
                      border: '1px solid #BFDBFE',
                      fontSize: 12, fontWeight: 700,
                    }}>
                      CBSE Class 10
                    </span>
                    {isPaid && (
                      <span style={{
                        padding: '4px 12px', borderRadius: 9999,
                        background: '#DCFCE7', color: '#15803D',
                        border: '1px solid #BBF7D0',
                        fontSize: 12, fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}>
                        <Crown size={12} color="#15803D" strokeWidth={2} />
                        Premium Unlocked
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => isPaid ? {} : triggerPaywall()}
                    style={{ height: 38, fontSize: 13, gap: 6, display: 'flex', alignItems: 'center' }}
                  >
                    <Download size={14} strokeWidth={2.5} />
                    Download PDF
                    {!isPaid && <Lock size={11} />}
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => isPaid ? window.print() : triggerPaywall()}
                    style={{ height: 38, fontSize: 13, gap: 6, display: 'flex', alignItems: 'center' }}
                  >
                    <Printer size={14} strokeWidth={2.5} />
                    Print
                  </button>
                  <button
                    className="btn btn-outline"
                    style={{ height: 38, fontSize: 13, gap: 6, display: 'flex', alignItems: 'center' }}
                  >
                    <Share2 size={14} strokeWidth={2.5} />
                    Share
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => isPaid ? {} : triggerPaywall()}
                    style={{ height: 38, fontSize: 13, gap: 6, display: 'flex', alignItems: 'center' }}
                  >
                    <RefreshCw size={14} strokeWidth={2.5} />
                    Regenerate
                    {!isPaid && <Lock size={11} />}
                  </button>
                </div>
              </div>

              {/* Metadata strip */}
              <div style={{
                background: 'white', border: '1px solid var(--gray-200)',
                borderRadius: 10, overflow: 'hidden',
                display: 'flex', flexWrap: 'wrap',
              }}>
                {[
                  { label: 'Based On',             value: '5 Years Papers + Syllabus + Textbook' },
                  { label: 'Prediction Confidence', value: '81% (High)', hi: true },
                  { label: 'Generated',             value: '27 May 2025, 10:30 AM' },
                  { label: 'Total Marks',           value: '80 Marks' },
                ].map((m, i, arr) => (
                  <div key={m.label} style={{
                    padding: '10px 18px',
                    borderRight: i < arr.length - 1 ? '1px solid var(--gray-200)' : 'none',
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: 3 }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: m.hi ? 'var(--success)' : 'var(--gray-900)', whiteSpace: 'nowrap' }}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tab switcher + view toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 12 }}>
                {/* Tabs */}
                <div style={{
                  display: 'flex', gap: 0,
                  background: 'var(--gray-100)', borderRadius: 10, padding: 4,
                }}>
                  {(['paper', 'instructions'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        padding: '7px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600,
                        border: 'none', cursor: 'pointer',
                        background: activeTab === tab ? 'white' : 'transparent',
                        color: activeTab === tab ? 'var(--gray-900)' : 'var(--gray-500)',
                        boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                        transition: 'all 200ms ease-out',
                        fontFamily: 'var(--font-sans)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {tab === 'paper' ? '📄 Question Paper' : '📋 Instructions'}
                    </button>
                  ))}
                </div>

                {/* View toggle */}
                <div style={{
                  display: 'flex', gap: 0,
                  background: 'var(--gray-100)', borderRadius: 10, padding: 4,
                }}>
                  {(['sections', 'marks'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      style={{
                        padding: '7px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                        border: 'none', cursor: 'pointer',
                        background: viewMode === mode ? 'white' : 'transparent',
                        color: viewMode === mode ? 'var(--gray-900)' : 'var(--gray-500)',
                        boxShadow: viewMode === mode ? '0 1px 4px rgba(0,0,0,0.10)' : 'none',
                        transition: 'all 200ms ease-out',
                        fontFamily: 'var(--font-sans)',
                        display: 'flex', alignItems: 'center', gap: 5,
                      }}
                    >
                      {mode === 'sections' ? '⊞ Sections' : '# Marks'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── PAPER BODY — two columns ── */}
            <div className="predict-layout-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.85fr) minmax(0,1fr)', gap: 20, alignItems: 'start' }}>

              {/* LEFT — Question Paper */}
              <div>
                {activeTab === 'instructions' ? (
                  /* Instructions tab */
                  <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16 }}>
                      General Instructions
                    </h3>
                    {[
                      'This question paper contains five sections A, B, C, D and E.',
                      'Section A has 20 MCQs carrying 1 mark each.',
                      'Section B has 5 questions carrying 02 marks each.',
                      'Section C has 6 questions carrying 03 marks each.',
                      'Section D has 4 questions carrying 05 marks each.',
                      'Section E has 3 case based integrated units of assessment (04 marks each).',
                      'All Questions are compulsory. However, an internal choice in 2 Qs of 5 marks, 2 Qs of 3 marks and 2 Questions of 2 marks has been provided.',
                      'Draw neat figures wherever required. Take π = 22/7 wherever required if not stated.',
                    ].map((inst, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: 'var(--brand-primary-light)', color: 'var(--brand-primary)',
                          fontSize: 11, fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginTop: 1,
                        }}>
                          {i + 1}
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.7, margin: 0 }}>{inst}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Question Paper tab */
                  <div>
                    {/* ── SECTION A ── */}
                    <SectionHeader
                      label="SECTION A"
                      type="Multiple Choice Questions"
                      instruction="All questions are compulsory."
                      marksEq="20 × 1 = 20"
                      color="linear-gradient(135deg,#1B4FD8 0%,#1440B0 100%)"
                    />
                    {visibleMCQ.map(q => (
                      <MCQCard key={q.id} q={q} />
                    ))}
                    {!isPaid && hiddenMCQCount > 0 && (
                      <>
                        <MCQCard q={SECTION_A[3]} locked />
                        <div style={{ position: 'relative', marginBottom: 8 }}>
                          <MCQCard q={SECTION_A[4]} locked />
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to bottom,transparent 0%,rgba(249,250,251,0.97) 55%)',
                            borderRadius: 10, display: 'flex',
                            alignItems: 'flex-end', justifyContent: 'center',
                            paddingBottom: 10,
                          }}>
                            <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>
                              … and <strong style={{ color: 'var(--brand-primary)' }}>{hiddenMCQCount - 2} more questions</strong>
                            </span>
                          </div>
                        </div>
                        <ExpandBtn onClick={triggerPaywall} />
                      </>
                    )}

                    <div style={{ height: 24 }} />

                    {/* ── SECTION B ── */}
                    <SectionHeader
                      label="SECTION B"
                      type="Short Answer Type Questions"
                      instruction="Answer any 5 questions."
                      marksEq="5 × 2 = 10"
                      color="linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)"
                    />
                    {visibleSA.map(q => (
                      <SACard key={q.id} q={q} />
                    ))}
                    {!isPaid && hiddenSACount > 0 && (
                      <>
                        <SACard q={SECTION_B[2]} locked />
                        <LockedSection count={hiddenSACount - 1} label="short answer" />
                        <ExpandBtn onClick={triggerPaywall} />
                      </>
                    )}

                    <div style={{ height: 24 }} />

                    {/* ── SECTION C (all locked for free) ── */}
                    <SectionHeader
                      label="SECTION C"
                      type="Long Answer Type Questions"
                      instruction="Answer all questions."
                      marksEq="6 × 3 = 18"
                      color="linear-gradient(135deg,#059669 0%,#047857 100%)"
                    />
                    {isPaid ? (
                      SECTION_C_PREVIEW.map(q => (
                        <div key={q.id} style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:10, padding:'14px 18px', marginBottom:10 }}>
                          <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                            <div style={{ width:28,height:28,borderRadius:7,background:'#ECFDF5',color:'#065F46',fontSize:12,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1 }}>{q.id}</div>
                            <div>
                              <p style={{ fontSize:14, lineHeight:1.75, color:'var(--gray-900)', margin:'0 0 10px' }}>{q.label}</p>
                              <div style={{ display:'flex', gap:6 }}>
                                <span style={{ padding:'2px 9px',borderRadius:9999,fontSize:11,fontWeight:600,background:'#ECFDF5',color:'#065F46',border:'1px solid #A7F3D0' }}>📚 {q.chapter}</span>
                                <span style={{ padding:'2px 9px',borderRadius:9999,fontSize:11,fontWeight:600,background:'#ECFDF5',color:'#065F46',border:'1px solid #A7F3D0' }}>{q.marks} Marks</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <LockedSection count={6} label="long answer" />
                        <ExpandBtn onClick={triggerPaywall} />
                      </>
                    )}

                    <div style={{ height: 24 }} />

                    {/* ── SECTION D (all locked for free) ── */}
                    <SectionHeader
                      label="SECTION D"
                      type="Long Answer Type Questions"
                      instruction="Answer all questions."
                      marksEq="4 × 5 = 20"
                      color="linear-gradient(135deg,#D97706 0%,#B45309 100%)"
                    />
                    {isPaid ? (
                      SECTION_D_PREVIEW.map(q => (
                        <div key={q.id} style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:10, padding:'14px 18px', marginBottom:10 }}>
                          <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                            <div style={{ width:28,height:28,borderRadius:7,background:'#FFFBEB',color:'#92400E',fontSize:12,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1 }}>{q.id}</div>
                            <div>
                              <p style={{ fontSize:14, lineHeight:1.75, color:'var(--gray-900)', margin:'0 0 10px' }}>{q.label}</p>
                              <div style={{ display:'flex', gap:6 }}>
                                <span style={{ padding:'2px 9px',borderRadius:9999,fontSize:11,fontWeight:600,background:'#FFFBEB',color:'#92400E',border:'1px solid #FDE68A' }}>📚 {q.chapter}</span>
                                <span style={{ padding:'2px 9px',borderRadius:9999,fontSize:11,fontWeight:600,background:'#FFFBEB',color:'#92400E',border:'1px solid #FDE68A' }}>{q.marks} Marks</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <LockedSection count={4} label="long answer" />
                        <ExpandBtn onClick={triggerPaywall} />
                      </>
                    )}

                    <div style={{ height: 24 }} />

                    {/* ── SECTION E (Case Study) ── */}
                    <SectionHeader
                      label="SECTION E"
                      type="Case-Based Questions"
                      instruction="Answer all questions."
                      marksEq="3 × 4 = 12"
                      color="linear-gradient(135deg,#0891B2 0%,#0E7490 100%)"
                    />
                    {isPaid ? (
                      SECTION_E_PREVIEW.map(q => (
                        <div key={q.id} style={{ background:'white', border:'1px solid var(--gray-200)', borderRadius:10, padding:'14px 18px', marginBottom:10 }}>
                          <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                            <div style={{ width:28,height:28,borderRadius:7,background:'#CFFAFE',color:'#0E7490',fontSize:12,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1 }}>{q.id}</div>
                            <div>
                              <p style={{ fontSize:14, lineHeight:1.75, color:'var(--gray-900)', margin:'0 0 10px' }}>{q.label}</p>
                              <div style={{ display:'flex', gap:6 }}>
                                <span style={{ padding:'2px 9px',borderRadius:9999,fontSize:11,fontWeight:600,background:'#CFFAFE',color:'#0E7490',border:'1px solid #A5F3FC' }}>📚 {q.chapter}</span>
                                <span style={{ padding:'2px 9px',borderRadius:9999,fontSize:11,fontWeight:600,background:'#CFFAFE',color:'#0E7490',border:'1px solid #A5F3FC' }}>{q.marks} Marks</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <LockedSection count={3} label="case study" />
                        <ExpandBtn onClick={triggerPaywall} />
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT — Paper Summary Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Paper Summary */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={15} color="var(--brand-primary)" strokeWidth={2} />
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--gray-900)', fontFamily: 'var(--font-display)' }}>Paper Summary</span>
                  </div>
                  <div style={{ padding: '12px 18px' }}>
                    {/* Big stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                      {PAPER_STATS.map(s => (
                        <div key={s.label} style={{
                          background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                          borderRadius: 10, padding: '12px 14px', textAlign: 'center',
                        }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    {/* Section breakdown */}
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                      Section Breakdown
                    </div>
                    {SECTION_STATS.map((s, i) => (
                      <div key={s.label} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 0',
                        borderBottom: i < SECTION_STATS.length - 1 ? '1px solid var(--gray-100)' : 'none',
                      }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-900)' }}>{s.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 1 }}>{s.q} questions</div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 900, color: 'var(--brand-primary)' }}>{s.marks}M</div>
                      </div>
                    ))}
                    <button style={{
                      width: '100%', height: 34, marginTop: 12,
                      border: '1px solid var(--gray-200)', borderRadius: 8,
                      background: 'white', fontSize: 12, fontWeight: 600,
                      color: 'var(--brand-primary)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontFamily: 'var(--font-sans)',
                      transition: 'all 200ms ease-out',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-primary-light)'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = 'var(--gray-200)'; }}
                    >
                      <BookOpen size={13} strokeWidth={2} />
                      View Marking Scheme
                    </button>
                  </div>
                </div>

                {/* Chapter Weightage donut */}
                <div className="card" style={{ padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray-900)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>
                    Chapter Weightage
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={CHAPTER_DATA} cx="50%" cy="50%" innerRadius={44} outerRadius={72} dataKey="value" strokeWidth={2} stroke="#F9FAFB">
                        {CHAPTER_DATA.map((_, i) => <Cell key={i} fill={CC[i % CC.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v}%`, 'Weightage']} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--gray-200)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {CHAPTER_DATA.slice(0, 4).map((d, i) => (
                      <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: CC[i], flexShrink: 0 }} />
                          <span style={{ color: 'var(--gray-700)', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question Type Distribution donut */}
                <div className="card" style={{ padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray-900)', fontFamily: 'var(--font-display)', marginBottom: 12 }}>
                    Question Type Distribution
                  </div>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie data={QTYPE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={68} dataKey="value" strokeWidth={2} stroke="#F9FAFB">
                        {QTYPE_DATA.map((_, i) => <Cell key={i} fill={CC[i % CC.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v}%`, 'Share']} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--gray-200)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {QTYPE_DATA.map((d, i) => (
                      <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: CC[i], flexShrink: 0 }} />
                          <span style={{ color: 'var(--gray-700)' }}>{d.name}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's Next */}
                <div className="card" style={{ padding: 18, background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)', border: '1px solid #C7D2FE' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Sparkles size={16} color="var(--brand-primary)" strokeWidth={2} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--brand-primary)', fontFamily: 'var(--font-display)' }}>What&apos;s Next?</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--gray-700)', lineHeight: 1.65, marginBottom: 14 }}>
                    Sharpen your preparation with chapter-wise practice questions tailored to your weak areas.
                  </p>
                  <button
                    style={{
                      width: '100%', height: 36,
                      background: 'var(--brand-primary)', color: 'white',
                      border: 'none', borderRadius: 8,
                      fontSize: 12, fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    View Preparation Plan →
                  </button>
                </div>
              </div>
            </div>

            {/* ── DISCLAIMER BANNER ── */}
            <div style={{
              marginTop: 28,
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 12,
              padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.65, margin: 0 }}>
                <strong>Disclaimer:</strong> This predicted paper is generated using AI analysis of past 5 years papers, syllabus and textbook. It is for smart preparation purposes only — actual exam questions may vary. Use it as a high-probability guide, not a replacement for thorough study!
              </p>
            </div>

          </div>{/* end main */}
        </div>
      </main>
      <Footer />
    </>
  );
}
