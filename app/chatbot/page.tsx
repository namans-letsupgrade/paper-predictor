'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Send, Image as ImageIcon, X, Sparkles, Brain, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I am your **PaperPredictor AI Solver**. \n\nType your math/science question here, or upload a photo of a sum, diagram, or equation to get an instant, step-by-step conceptual solution!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be under 5MB.');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imagePreview) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      image: imagePreview || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setImagePreview(null);
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          image: userMsg.image
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get answer.');

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, background: 'linear-gradient(135deg, #f5f8ff 0%, #edf2f9 100%)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--gray-200)', padding: '16px 0', zIndex: 10 }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link href="/" style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--gray-600)', transition: 'background 200ms'
              }} onMouseEnter={e => e.currentTarget.style.background = '#e5eaf5'} onMouseLeave={e => e.currentTarget.style.background = 'var(--gray-100)'}>
                <ArrowLeft size={16} />
              </Link>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    padding: '2px 8px', background: 'var(--brand-primary-light)',
                    color: 'var(--brand-primary)', borderRadius: 9999, fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    <Sparkles size={10} /> AI SOLVER
                  </span>
                </div>
                <h1 style={{ fontSize: 18, fontWeight: 900, color: 'var(--gray-900)', marginTop: 2, fontFamily: 'var(--font-display)' }}>
                  Math &amp; Science AI Chatbot
                </h1>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-only">
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)' }}>Gemini Powered Solver</span>
            </div>
          </div>
        </div>

        {/* CHAT CONTAINER */}
        <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 16px', maxWidth: 800 }}>
          <div style={{
            flex: 1,
            background: 'white',
            border: '1px solid var(--gray-200)',
            borderRadius: 24,
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: '60vh'
          }}>
            
            {/* MESSAGE LIST */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}>
              {messages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 12
                }}>
                  {/* AI Avatar */}
                  {msg.role === 'assistant' && (
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: 16, flexShrink: 0
                    }}>
                      <Brain size={16} />
                    </div>
                  )}

                  {/* Bubble */}
                  <div style={{
                    maxWidth: '80%',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #1b4fd8 0%, #2563eb 100%)' : '#f3f4f6',
                    color: msg.role === 'user' ? 'white' : 'var(--gray-800)',
                    padding: '14px 18px',
                    borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    fontSize: 14,
                    lineHeight: 1.6,
                    boxShadow: msg.role === 'user' ? '0 4px 12px rgba(27,79,216,0.15)' : 'none'
                  }}>
                    {msg.image && (
                      <div style={{ marginBottom: 12, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={msg.image} alt="Uploaded Problem" style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }} />
                      </div>
                    )}
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loader */}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', flexShrink: 0
                  }}>
                    <Brain size={16} />
                  </div>
                  <div style={{
                    background: '#f3f4f6',
                    padding: '12px 18px',
                    borderRadius: '18px 18px 18px 2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: 'var(--gray-500)'
                  }}>
                    <Loader2 size={14} className="animate-spin" />
                    <span>AI Solver is thinking...</span>
                  </div>
                </div>
              )}

              {error && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  borderRadius: 12,
                  padding: '12px 16px',
                  color: '#dc2626',
                  fontSize: 13,
                  textAlign: 'center'
                }}>
                  ⚠ {error}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* INPUT INPUT BOX */}
            <form onSubmit={handleSend} style={{
              borderTop: '1px solid var(--gray-200)',
              background: '#f9fafb',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {/* Image Preview bar */}
              {imagePreview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid var(--gray-200)', padding: '8px 12px', borderRadius: 12, alignSelf: 'flex-start' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="upload preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                  <div style={{ fontSize: 12, color: 'var(--gray-600)', fontWeight: 600 }}>Problem Photo Added</div>
                  <button type="button" onClick={handleRemoveImage} style={{
                    width: 20, height: 20, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'
                  }}>
                    <X size={12} />
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                {/* File picker */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload photo of your problem"
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'white', border: '1px solid var(--gray-200)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--gray-600)', transition: 'border 200ms'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
                >
                  <ImageIcon size={18} />
                </button>

                {/* Input box */}
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a math/science sum or question here..."
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 12,
                    border: '1px solid var(--gray-200)',
                    padding: '0 16px',
                    fontSize: 14,
                    background: 'white',
                    outline: 'none',
                    transition: 'border 200ms'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--brand-primary)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
                />

                {/* Send */}
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !imagePreview)}
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: (loading || (!input.trim() && !imagePreview)) ? '#d1d5db' : 'linear-gradient(135deg, #1b4fd8 0%, #2563eb 100%)',
                    color: 'white', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: (loading || (!input.trim() && !imagePreview)) ? 'not-allowed' : 'pointer',
                    boxShadow: (loading || (!input.trim() && !imagePreview)) ? 'none' : '0 4px 12px rgba(27,79,216,0.2)'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
