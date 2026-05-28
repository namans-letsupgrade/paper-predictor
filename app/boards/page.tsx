'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, ArrowRight, BookOpen, GraduationCap, Award } from 'lucide-react';

interface Board {
  id: string;
  name: string;
  fullName: string;
  type: 'school' | 'entrance';
  subjects: number;
  years: number;
  gradient: string;
  color: string;
  badgeText?: string;
  logoChar: string;
}

const BOARDS: Board[] = [
  {
    id: 'cbse',
    name: 'CBSE',
    fullName: 'Central Board of Secondary Education',
    type: 'school',
    subjects: 15,
    years: 5,
    gradient: 'linear-gradient(135deg, #1B4FD8 0%, #1440B0 100%)',
    color: '#1B4FD8',
    badgeText: 'Most Popular',
    logoChar: 'C'
  },
  {
    id: 'icse',
    name: 'ICSE & ISC',
    fullName: 'Council for the Indian School Certificate Examinations',
    type: 'school',
    subjects: 12,
    years: 5,
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
    color: '#4F46E5',
    logoChar: 'I'
  },
  {
    id: 'msb',
    name: 'Maharashtra State Board',
    fullName: 'MSBSHSE - Class 10 & 12',
    type: 'school',
    subjects: 10,
    years: 5,
    gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    color: '#D97706',
    logoChar: 'M'
  },
  {
    id: 'karnataka',
    name: 'Karnataka Board',
    fullName: 'KSEAB - SSLC & 2nd PUC',
    type: 'school',
    subjects: 8,
    years: 5,
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    color: '#0284C7',
    logoChar: 'K'
  },
  {
    id: 'up',
    name: 'UP Board',
    fullName: 'Board of High School and Intermediate Education UP',
    type: 'school',
    subjects: 8,
    years: 4,
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    color: '#059669',
    logoChar: 'U'
  },
  {
    id: 'jee',
    name: 'JEE Main & Advanced',
    fullName: 'Joint Entrance Examination (Engineering)',
    type: 'entrance',
    subjects: 3,
    years: 5,
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
    color: '#7C3AED',
    badgeText: 'Engineering',
    logoChar: 'J'
  },
  {
    id: 'neet',
    name: 'NEET UG',
    fullName: 'National Eligibility cum Entrance Test (Medical)',
    type: 'entrance',
    subjects: 3,
    years: 5,
    gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
    color: '#EC4899',
    badgeText: 'Medical',
    logoChar: 'N'
  },
  {
    id: 'mhtcet',
    name: 'MHT-CET',
    fullName: 'Maharashtra Common Entrance Test',
    type: 'entrance',
    subjects: 3,
    years: 5,
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    color: '#0EA5E9',
    logoChar: 'M'
  }
];

export default function BoardsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'school' | 'entrance'>('all');

  const filteredBoards = BOARDS.filter(board => {
    const matchesSearch = board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          board.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || board.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--gray-50)' }}>
        {/* Banner Hero */}
        <section className="section-sm" style={{
          background: 'linear-gradient(135deg, #1B4FD8 0%, #1440B0 50%, #4F46E5 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: 10,
              color: 'white'
            }}>
              Supported Boards & Entrance Exams
            </h1>
            <p style={{
              fontSize: 15,
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: 560,
              margin: '0 auto 28px',
              lineHeight: 1.6
            }}>
              Access exam predictions, previous year papers, chapter weightages, and core preparation guides for major boards and entrance exams.
            </p>

            {/* Interactive Search Bar */}
            <div style={{
              maxWidth: 500,
              margin: '0 auto',
              position: 'relative',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
            }}>
              <Search
                size={18}
                color="var(--gray-400)"
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2
                }}
              />
              <input
                type="text"
                placeholder="Search board or exam (e.g. CBSE, JEE)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: 48,
                  padding: '0 16px 0 46px',
                  borderRadius: 14,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--gray-900)',
                  outline: 'none',
                  background: 'white'
                }}
              />
            </div>
          </div>
        </section>

        {/* Filters and Grid Section */}
        <section className="section" style={{ paddingTop: 36 }}>
          <div className="container">
            {/* Category Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 36,
              flexWrap: 'wrap'
            }}>
              {[
                { label: 'All Exams', value: 'all', icon: GraduationCap },
                { label: 'School Boards', value: 'school', icon: BookOpen },
                { label: 'Entrance Exams', value: 'entrance', icon: Award }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value as 'all' | 'school' | 'entrance')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 20px',
                      borderRadius: 9999,
                      fontSize: 13,
                      fontWeight: 600,
                      background: isActive ? 'var(--brand-primary-light)' : 'white',
                      color: isActive ? 'var(--brand-primary)' : 'var(--gray-500)',
                      border: isActive ? '1px solid #BFDBFE' : '1px solid var(--gray-200)',
                      boxShadow: isActive ? 'none' : 'var(--shadow-sm)',
                      transition: 'all 200ms ease-out'
                    }}
                  >
                    <Icon size={15} strokeWidth={2} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            {filteredBoards.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 20
              }}>
                {filteredBoards.map(board => (
                  <div
                    key={board.id}
                    className="card"
                    style={{
                      background: 'white',
                      border: '1px solid var(--gray-200)',
                      borderRadius: 16,
                      padding: 24,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 220,
                      position: 'relative',
                      boxShadow: 'var(--shadow-card)',
                      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(27,79,216,0.12)';
                      e.currentTarget.style.borderColor = 'var(--gray-300)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                      e.currentTarget.style.borderColor = 'var(--gray-200)';
                    }}
                  >
                    {/* Badge */}
                    {board.badgeText && (
                      <span className={`badge ${board.id === 'cbse' ? 'badge-blue' : board.id === 'jee' ? 'badge-indigo' : 'badge-red'}`} style={{
                        position: 'absolute',
                        top: 18,
                        right: 18,
                        fontSize: 10,
                        fontWeight: 700
                      }}>
                        {board.badgeText}
                      </span>
                    )}

                    {/* Logo representation / Header */}
                    <div>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: board.gradient,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 900,
                        fontFamily: 'var(--font-display)',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        marginBottom: 16
                      }}>
                        {board.logoChar}
                      </div>

                      <h3 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 16,
                        fontWeight: 800,
                        color: 'var(--gray-900)',
                        marginBottom: 4,
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3
                      }}>
                        {board.name}
                      </h3>
                      <p style={{
                        fontSize: 12,
                        color: 'var(--gray-400)',
                        lineHeight: 1.4,
                        marginBottom: 20
                      }}>
                        {board.fullName}
                      </p>
                    </div>

                    {/* Stats & CTA */}
                    <div>
                      <div style={{
                        display: 'flex',
                        gap: 16,
                        borderTop: '1px solid var(--gray-100)',
                        paddingTop: 12,
                        marginBottom: 16
                      }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subjects</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginTop: 2 }}>{board.subjects} Available</div>
                        </div>
                        <div style={{ width: 1, background: 'var(--gray-100)' }} />
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Past Papers</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginTop: 2 }}>{board.years} Years</div>
                        </div>
                      </div>

                      <button
                        style={{
                          width: '100%',
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          background: 'var(--gray-50)',
                          border: '1px solid var(--gray-200)',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--brand-primary)',
                          transition: 'all 200ms ease-out'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'var(--brand-primary-light)';
                          e.currentTarget.style.borderColor = '#BFDBFE';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'var(--gray-50)';
                          e.currentTarget.style.borderColor = 'var(--gray-200)';
                        }}
                      >
                        <span>View Classes</span>
                        <ArrowRight size={13} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px 0', background: 'white', borderRadius: 16, border: '1px solid var(--gray-200)' }}>
                <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>No exams or boards found matching &quot;{searchQuery}&quot;.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
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
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
