'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, FileText, Download, RefreshCw, Layers, Layout, ChevronRight } from 'lucide-react';

interface Prediction {
  id: string;
  subject: string;
  board: string;
  class: string;
  confidenceScore: number;
  confidenceLabel: 'High' | 'Medium' | 'Low';
  generatedDate: string;
  status: 'Active' | 'Expired' | 'Regenerated';
  regenCount: number;
  maxRegen: number;
}

const MOCK_PREDICTIONS: Prediction[] = [
  {
    id: 'math-10',
    subject: 'Mathematics',
    board: 'CBSE',
    class: 'Class 10',
    confidenceScore: 81,
    confidenceLabel: 'High',
    generatedDate: '26 May 2025',
    status: 'Active',
    regenCount: 2,
    maxRegen: 3
  },
  {
    id: 'phys-12',
    subject: 'Physics',
    board: 'CBSE',
    class: 'Class 12',
    confidenceScore: 78,
    confidenceLabel: 'Medium',
    generatedDate: '24 May 2025',
    status: 'Active',
    regenCount: 1,
    maxRegen: 3
  },
  {
    id: 'chem-jee',
    subject: 'Chemistry',
    board: 'JEE Main',
    class: 'JEE Aspirant',
    confidenceScore: 68,
    confidenceLabel: 'Medium',
    generatedDate: '20 May 2025',
    status: 'Regenerated',
    regenCount: 3,
    maxRegen: 3
  },
  {
    id: 'bio-neet',
    subject: 'Biology',
    board: 'NEET UG',
    class: 'NEET Aspirant',
    confidenceScore: 84,
    confidenceLabel: 'High',
    generatedDate: '10 May 2025',
    status: 'Expired',
    regenCount: 0,
    maxRegen: 3
  }
];

export default function MyPredictionsPage() {
  const router = useRouter();
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [boardFilter, setBoardFilter] = useState('all');

  const filteredPredictions = MOCK_PREDICTIONS.filter(p => {
    // Status filter logic
    if (statusFilter === 'active' && p.status !== 'Active' && p.status !== 'Regenerated') return false;
    if (statusFilter === 'completed' && p.status !== 'Expired') return false;

    // Board filter logic
    if (boardFilter !== 'all') {
      if (boardFilter === 'cbse' && p.board !== 'CBSE') return false;
      if (boardFilter === 'jeeneet' && p.board !== 'JEE Main' && p.board !== 'NEET UG') return false;
      if (boardFilter === 'others' && (p.board === 'CBSE' || p.board === 'JEE Main' || p.board === 'NEET UG')) return false;
    }

    return true;
  });

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--gray-50)', paddingBottom: 80 }}>
        {/* Sub-Header Actions */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '12px 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Quick Toggle (Testing):
              </span>
              <button
                onClick={() => setIsEmptyState(!isEmptyState)}
                style={{
                  background: 'var(--gray-100)',
                  border: '1.5px solid var(--gray-300)',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--brand-primary)',
                  cursor: 'pointer'
                }}
              >
                Switch to {isEmptyState ? 'Filled State' : 'Empty State'}
              </button>
            </div>
            <button
              onClick={() => router.push('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--brand-primary-light)',
                border: '1px solid #BFDBFE',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--brand-primary)'
              }}
            >
              <Sparkles size={13} strokeWidth={2.5} />
              New Prediction
            </button>
          </div>
        </div>

        <div className="container" style={{ marginTop: 28 }}>
          {isEmptyState ? (
            /* EMPTY STATE */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              background: 'white',
              border: '1px solid var(--gray-200)',
              borderRadius: 24,
              padding: '64px 32px',
              maxWidth: 600,
              margin: '40px auto 0',
              boxShadow: 'var(--shadow-card)'
            }}>
              {/* Illustration placeholder */}
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: 'var(--brand-primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 48, marginBottom: 24,
                boxShadow: '0 8px 24px rgba(27,79,216,0.1)'
              }}>
                📄
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--gray-900)',
                letterSpacing: '-0.02em',
                marginBottom: 8
              }}>
                No predictions yet
              </h2>
              <p style={{
                fontSize: 14,
                color: 'var(--gray-500)',
                lineHeight: 1.6,
                maxWidth: 360,
                marginBottom: 28
              }}>
                Start by selecting your board, class, and subject on our predictor tool to generate a paper.
              </p>
              <button
                onClick={() => router.push('/')}
                style={{
                  height: 44,
                  padding: '0 24px',
                  background: 'var(--grad-blue)',
                  color: 'white',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: 'var(--shadow-blue)',
                  transition: 'all 200ms'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1440B0, #122F8A)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--grad-blue)'}
              >
                <span>Make Your First Prediction</span>
                <ChevronRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            /* FILLED STATE */
            <div>
              {/* Title Header */}
              <div style={{ marginBottom: 28 }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 32,
                  fontWeight: 800,
                  color: 'var(--gray-900)',
                  letterSpacing: '-0.025em'
                }}>
                  My Predictions
                </h1>
                <p style={{ fontSize: 14, color: 'var(--gray-500)', marginTop: 4 }}>
                  Manage, print, and regenerate your AI-predicted practice exam papers.
                </p>
              </div>

              {/* Filter Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                marginBottom: 24
              }}>
                {/* Status Tabs */}
                <div style={{
                  display: 'flex',
                  background: 'var(--gray-100)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 10,
                  padding: 4
                }}>
                  {([
                    { label: 'All', value: 'all' },
                    { label: 'Active', value: 'active' },
                    { label: 'Completed', value: 'completed' }
                  ] as const).map(tab => (
                    <button
                      key={tab.value}
                      onClick={() => setStatusFilter(tab.value)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        transition: 'all 200ms',
                        background: statusFilter === tab.value ? 'white' : 'transparent',
                        color: statusFilter === tab.value ? 'var(--gray-900)' : 'var(--gray-500)',
                        boxShadow: statusFilter === tab.value ? 'var(--shadow-sm)' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Dropdown filters */}
                <div>
                  <select
                    className="select-styled"
                    value={boardFilter}
                    onChange={e => setBoardFilter(e.target.value)}
                    style={{ height: 38, width: 160, padding: '0 32px 0 10px', backgroundPosition: 'right 8px center' }}
                  >
                    <option value="all">All Boards</option>
                    <option value="cbse">CBSE</option>
                    <option value="jeeneet">JEE & NEET</option>
                    <option value="others">Other Boards</option>
                  </select>
                </div>
              </div>

              {/* Card Grid */}
              {filteredPredictions.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
                  gap: 20
                }}>
                  {filteredPredictions.map(p => {
                    const isExpired = p.status === 'Expired';
                    const labelColorClass =
                      p.status === 'Active' ? 'badge-green' :
                      p.status === 'Regenerated' ? 'badge-blue' : 'badge-gray';

                    const confColorClass =
                      p.confidenceLabel === 'High' ? 'badge-green' : 'badge-amber';

                    return (
                      <div
                        key={p.id}
                        className="card"
                        style={{
                          background: 'white',
                          border: '1px solid var(--gray-200)',
                          borderRadius: 16,
                          padding: 24,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: 'var(--shadow-card)',
                          opacity: isExpired ? 0.85 : 1,
                          transition: 'all 200ms'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                        }}
                      >
                        {/* Header metadata */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                              <h3 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 18,
                                fontWeight: 800,
                                color: 'var(--gray-900)',
                                marginBottom: 3
                              }}>
                                {p.subject}
                              </h3>
                              <p style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>
                                {p.board} · {p.class}
                              </p>
                            </div>
                            {/* Badges container */}
                            <div style={{ display: 'flex', gap: 6 }}>
                              <span className={`badge ${confColorClass}`} style={{ fontSize: 10, padding: '3px 8px' }}>
                                🎯 {p.confidenceScore}% {p.confidenceLabel}
                              </span>
                              <span className={`badge ${labelColorClass}`} style={{ fontSize: 10, padding: '3px 8px' }}>
                                {p.status}
                              </span>
                            </div>
                          </div>

                          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 20 }}>
                            Generated on: <strong>{p.generatedDate}</strong>
                          </div>
                        </div>

                        {/* Actions / Regenerations */}
                        <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 16 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>
                              Regenerations remaining: <strong style={{ color: p.regenCount > 0 ? 'var(--brand-primary)' : 'var(--gray-500)' }}>{p.regenCount}/{p.maxRegen}</strong>
                            </span>
                          </div>

                          {/* CTA Row */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 8 }}>
                            <button
                              onClick={() => {
                                if (!isExpired) router.push(`/predict/${p.id}/paper`);
                              }}
                              disabled={isExpired}
                              style={{
                                height: 36,
                                background: isExpired ? 'var(--gray-100)' : 'var(--brand-primary-light)',
                                border: isExpired ? '1px solid var(--gray-200)' : '1px solid #BFDBFE',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 700,
                                color: isExpired ? 'var(--gray-400)' : 'var(--brand-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                cursor: isExpired ? 'not-allowed' : 'pointer',
                                transition: 'all 200ms'
                              }}
                              onMouseEnter={e => { if (!isExpired) e.currentTarget.style.background = '#DBEAFE'; }}
                              onMouseLeave={e => { if (!isExpired) e.currentTarget.style.background = 'var(--brand-primary-light)'; }}
                            >
                              <FileText size={13} strokeWidth={2.5} />
                              View Paper
                            </button>

                            <button
                              disabled={isExpired}
                              style={{
                                height: 36,
                                background: 'white',
                                border: '1px solid var(--gray-200)',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                color: isExpired ? 'var(--gray-400)' : 'var(--gray-700)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 5,
                                cursor: isExpired ? 'not-allowed' : 'pointer'
                              }}
                              onMouseEnter={e => { if (!isExpired) { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.color = 'var(--brand-primary)'; } }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-700)'; }}
                            >
                              <Download size={13} strokeWidth={2} />
                              PDF
                            </button>

                            <button
                              disabled={isExpired || p.regenCount === 0}
                              style={{
                                height: 36,
                                background: 'white',
                                border: '1px solid var(--gray-200)',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                color: (isExpired || p.regenCount === 0) ? 'var(--gray-400)' : 'var(--gray-700)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 5,
                                cursor: (isExpired || p.regenCount === 0) ? 'not-allowed' : 'pointer'
                              }}
                              onMouseEnter={e => { if (!isExpired && p.regenCount > 0) { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.color = 'var(--brand-primary)'; } }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.color = 'var(--gray-700)'; }}
                            >
                              <RefreshCw size={13} strokeWidth={2} />
                              Regen
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0', background: 'white', borderRadius: 16, border: '1px solid var(--gray-200)' }}>
                  <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>No predictions match the active filter criteria.</p>
                  <button
                    onClick={() => { setStatusFilter('all'); setBoardFilter('all'); }}
                    style={{
                      color: 'var(--brand-primary)',
                      background: 'none',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      marginTop: 8,
                      textDecoration: 'underline'
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
