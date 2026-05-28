'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Upload, CheckCircle2, Loader2, ArrowRight, Gift, File, Trash2 } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: string;
}

export default function StudentUploadPage() {
  const router = useRouter();
  const [examType, setExamType] = useState('');
  const [board, setBoard] = useState('');
  const [cls, setCls] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addMockFile();
  };

  const addMockFile = () => {
    if (files.length >= 5) return;
    const names = [
      'cbse-maths-preboard-2024.pdf',
      'coaching-mock-math-set1.pdf',
      'school-terminal-exam-paper.png',
      'maths-practice-questions.pdf',
      'past-year-board-extract.jpg'
    ];
    const newFile: UploadedFile = {
      name: names[files.length],
      size: (Math.random() * 4 + 1.2).toFixed(1) + ' MB'
    };
    setFiles([...files, newFile]);
  };

  const deleteFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const startProcessing = () => {
    if (!examType || !board || !cls || !subject || !year || files.length === 0) {
      alert('Please fill in all form details and upload at least one paper.');
      return;
    }

    setIsProcessing(true);
    setProcessStep(0);

    // Simulate the question paper processing pipeline step-by-step
    const timers = [
      setTimeout(() => setProcessStep(1), 1500), // File uploaded done -> Extracting Qs
      setTimeout(() => setProcessStep(2), 3000), // Extracting done (32 Qs) -> Chapter mapping
      setTimeout(() => setProcessStep(3), 4500), // Chapter mapping done -> Running engine
      setTimeout(() => setProcessStep(4), 6000), // Engine running -> Ready
    ];

    return () => timers.forEach(clearTimeout);
  };

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--gray-50)', paddingBottom: 80 }}>
        {/* Hero Section */}
        <section className="section-sm" style={{ textAlign: 'center', background: 'white', borderBottom: '1px solid var(--gray-200)' }}>
          <div className="container">
            <span className="section-pill">
              📤 Upload & Predict
            </span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 3.5vw, 38px)',
              fontWeight: 800,
              color: 'var(--gray-900)',
              letterSpacing: '-0.02em',
              marginBottom: 10
            }}>
              Upload Your Own Past Papers
            </h1>
            <p style={{
              fontSize: 15,
              color: 'var(--gray-500)',
              maxWidth: 580,
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Have past papers from your coaching or school? Upload them and we will run our AI analytics engine to predict your next board/entrance exam paper.
            </p>
          </div>
        </section>

        <div className="container" style={{ marginTop: 36 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isProcessing ? '1fr' : 'minmax(0, 1.8fr) minmax(0, 1fr)',
            gap: 28,
            alignItems: 'start',
            maxWidth: isProcessing ? 600 : 1050,
            margin: '0 auto'
          }}>

            {/* LEFT - Form or Processing Pipeline */}
            {isProcessing ? (
              /* PROCESSING TIMELINE */
              <div className="card" style={{ padding: '36px 32px', borderRadius: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 24, textAlign: 'center' }}>
                  AI Analytics Engine Running...
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400, margin: '0 auto 32px' }}>
                  {/* Step 1: File Uploaded */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <CheckCircle2 size={22} color="var(--success)" fill="var(--success-light)" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' }}>File uploaded successfully</span>
                  </div>

                  {/* Step 2: Question Extraction */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {processStep >= 2 ? (
                      <CheckCircle2 size={22} color="var(--success)" fill="var(--success-light)" />
                    ) : processStep === 1 ? (
                      <Loader2 size={22} color="var(--brand-primary)" className="anim-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid var(--gray-300)' }} />
                    )}
                    <span style={{
                      fontSize: 14,
                      fontWeight: processStep >= 1 ? 600 : 500,
                      color: processStep >= 1 ? 'var(--gray-700)' : 'var(--gray-400)'
                    }}>
                      {processStep >= 2 ? 'Questions extracted: 32' : 'Extracting questions...'}
                    </span>
                  </div>

                  {/* Step 3: Chapter Mapping */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {processStep >= 3 ? (
                      <CheckCircle2 size={22} color="var(--success)" fill="var(--success-light)" />
                    ) : processStep === 2 ? (
                      <Loader2 size={22} color="var(--brand-primary)" className="anim-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid var(--gray-300)' }} />
                    )}
                    <span style={{
                      fontSize: 14,
                      fontWeight: processStep >= 2 ? 600 : 500,
                      color: processStep >= 2 ? 'var(--gray-700)' : 'var(--gray-400)'
                    }}>
                      {processStep >= 3 ? 'Chapter & topic mapping complete' : 'Mapping questions to syllabus...'}
                    </span>
                  </div>

                  {/* Step 4: Run Prediction */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {processStep >= 4 ? (
                      <CheckCircle2 size={22} color="var(--success)" fill="var(--success-light)" />
                    ) : processStep === 3 ? (
                      <Loader2 size={22} color="var(--brand-primary)" className="anim-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid var(--gray-300)' }} />
                    )}
                    <span style={{
                      fontSize: 14,
                      fontWeight: processStep >= 3 ? 600 : 500,
                      color: processStep >= 3 ? 'var(--gray-700)' : 'var(--gray-400)'
                    }}>
                      {processStep >= 4 ? 'Predicted paper ready!' : 'Running prediction engine...'}
                    </span>
                  </div>
                </div>

                {/* Submit Action once Ready */}
                {processStep >= 4 && (
                  <div style={{ textAlign: 'center', animation: 'fadeInUp 0.3s ease both' }}>
                    <button
                      onClick={() => router.push('/predict/math-10/paper')}
                      style={{
                        height: 48,
                        padding: '0 32px',
                        background: 'linear-gradient(135deg, #16A34A, #15803D)',
                        color: 'white',
                        borderRadius: 12,
                        fontSize: 15,
                        fontWeight: 800,
                        boxShadow: '0 6px 20px rgba(22,163,74,0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer'
                      }}
                    >
                      <span>View Predicted Paper</span>
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* UPLOAD FORM */
              <div className="card" style={{ padding: 28, borderRadius: 20 }}>
                {/* Step 1: Exam Type */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: 8 }}>
                    Step 1: Select Exam Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                    {[
                      { label: 'Board Exams', value: 'board' },
                      { label: 'Entrance Exams', value: 'entrance' },
                      { label: 'Coaching / College', value: 'college' }
                    ].map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setExamType(type.value)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 600,
                          background: examType === type.value ? 'var(--brand-primary-light)' : 'var(--gray-50)',
                          color: examType === type.value ? 'var(--brand-primary)' : 'var(--gray-500)',
                          border: examType === type.value ? '1.5px solid var(--brand-primary)' : '1.5px solid var(--gray-200)',
                          cursor: 'pointer',
                          transition: 'all 200ms'
                        }}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Metadata */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: 8 }}>
                    Step 2: Enter Paper Details
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 12 }}>
                    <div>
                      <input
                        type="text"
                        placeholder="Board (e.g. CBSE, ICSE)"
                        value={board}
                        onChange={e => setBoard(e.target.value)}
                        style={{
                          width: '100%',
                          height: 44,
                          padding: '0 12px',
                          borderRadius: 10,
                          border: '1px solid var(--gray-200)',
                          fontSize: 13,
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Class / Level (e.g. Class 10)"
                        value={cls}
                        onChange={e => setCls(e.target.value)}
                        style={{
                          width: '100%',
                          height: 44,
                          padding: '0 12px',
                          borderRadius: 10,
                          border: '1px solid var(--gray-200)',
                          fontSize: 13,
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <input
                        type="text"
                        placeholder="Subject (e.g. Mathematics)"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        style={{
                          width: '100%',
                          height: 44,
                          padding: '0 12px',
                          borderRadius: 10,
                          border: '1px solid var(--gray-200)',
                          fontSize: 13,
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Exam Year (e.g. 2024)"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                        style={{
                          width: '100%',
                          height: 44,
                          padding: '0 12px',
                          borderRadius: 10,
                          border: '1px solid var(--gray-200)',
                          fontSize: 13,
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Drag & drop upload zone */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: 8 }}>
                    Step 3: Upload Past Papers
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={addMockFile}
                    style={{
                      border: '2px dashed var(--brand-primary)',
                      borderRadius: 16,
                      background: 'var(--brand-primary-light)',
                      padding: '36px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 200ms'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--brand-primary-light)'}
                  >
                    <Upload size={32} color="var(--brand-primary)" style={{ margin: '0 auto 12px' }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                      Drag & drop your paper PDFs here, or click to browse
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                      Supports PDF, JPG, PNG. Max 10MB per file. (Up to 5 files)
                    </div>
                  </div>
                </div>

                {/* Files List */}
                {files.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                      Selected Files ({files.length}/5)
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {files.map((file, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--gray-50)',
                            border: '1px solid var(--gray-200)',
                            borderRadius: 8,
                            padding: '8px 12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <File size={15} color="var(--gray-500)" />
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {file.name}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>({file.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteFile(idx)}
                            style={{ color: 'var(--danger)', padding: 4, cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Submit */}
                <button
                  onClick={startProcessing}
                  style={{
                    width: '100%',
                    height: 44,
                    background: 'var(--grad-blue)',
                    color: 'white',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-blue)',
                    cursor: 'pointer',
                    transition: 'all 200ms'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1440B0, #122F8A)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--grad-blue)'}
                >
                  Upload & Run Prediction Engine
                </button>
              </div>
            )}

            {/* RIGHT - Rewards Banner & Info (hidden in processing) */}
            {!isProcessing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Reward Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #FFFDF5 0%, #FFFBEB 100%)',
                  border: '2px solid #FDE68A',
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: 'var(--shadow-card)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Gift size={20} color="#D97706" />
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#92400E', fontFamily: 'var(--font-display)' }}>
                      Earn Free Prediction Credits!
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.6, marginBottom: 14 }}>
                    Help us expand our predictions. Upload past papers from school, college, or coaching institutes.
                  </p>
                  <div style={{ background: 'white', borderRadius: 8, padding: '10px 14px', border: '1px solid #FDE68A', fontSize: 12, fontWeight: 700, color: '#B45309', textAlign: 'center' }}>
                    🎁 Each approved paper = 1 free prediction credit
                  </div>
                </div>

                {/* Guidelines */}
                <div className="card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--gray-500)', marginBottom: 12 }}>
                    Upload Guidelines
                  </div>
                  <ul style={{ paddingLeft: 16, fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.8 }}>
                    <li>Ensure text is clearly legible (not blurry).</li>
                    <li>Upload all pages of the paper in order.</li>
                    <li>Double check that subject and year matches.</li>
                    <li>Coaching mock exams (e.g. Allen, FITJEE, NIIT) are highly welcome!</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
