'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Image as ImageIcon, X, Loader2, Sparkles, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! Ask me any math or science question, or upload a photo of a problem, and I will solve it step-by-step!'
    }
  ]);
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image should be under 5MB.');
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
      image: imagePreview || undefined
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

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: 'var(--font-sans)' }}>
      {/* ── CHAT WINDOW PANEL ── */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          right: '0',
          width: '360px',
          height: '500px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
          border: '1px solid var(--gray-200)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1b4fd8 0%, #2563eb 100%)',
            padding: '16px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 4 }}>
                  AI Solver <Sparkles size={11} />
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  Online &bull; step-by-step tutor
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none', border: 'none', color: 'white',
                cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            background: '#f8fafc'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 8
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1b4fd8 0%, #2563eb 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', flexShrink: 0
                  }}>
                    <Bot size={13} />
                  </div>
                )}
                <div style={{
                  maxWidth: '75%',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #1b4fd8 0%, #2563eb 100%)' : 'white',
                  color: msg.role === 'user' ? 'white' : 'var(--gray-800)',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  fontSize: 13,
                  lineHeight: 1.5,
                  border: msg.role === 'assistant' ? '1px solid var(--gray-200)' : 'none',
                  boxShadow: msg.role === 'user' ? '0 2px 8px rgba(27,79,216,0.1)' : '0 1px 2px rgba(0,0,0,0.02)'
                }}>
                  {msg.image && (
                    <div style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={msg.image} alt="sum" style={{ maxWidth: '100%', maxHeight: 160, objectFit: 'contain' }} />
                    </div>
                  )}
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1b4fd8 0%, #2563eb 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', flexShrink: 0
                }}>
                  <Bot size={13} />
                </div>
                <div style={{
                  background: 'white',
                  border: '1px solid var(--gray-200)',
                  padding: '8px 12px',
                  borderRadius: '14px 14px 14px 2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: 'var(--gray-500)'
                }}>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            {error && (
              <div style={{ fontSize: 11, padding: '8px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 8, color: '#dc2626', textAlign: 'center' }}>
                ⚠ {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} style={{
            padding: '12px',
            borderTop: '1px solid var(--gray-200)',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            {imagePreview && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '6px 10px', borderRadius: 8, alignSelf: 'flex-start', border: '1px solid var(--gray-200)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="preview" style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4 }} />
                <span style={{ fontSize: 11, color: 'var(--gray-600)', fontWeight: 600 }}>Photo attached</span>
                <button type="button" onClick={handleRemoveImage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', display: 'flex' }}>
                  <X size={12} />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: 6 }}>
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
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'none', border: '1px solid var(--gray-200)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--gray-500)'
                }}
              >
                <ImageIcon size={16} />
              </button>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask or attach a sum..."
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 8,
                  border: '1px solid var(--gray-200)',
                  padding: '0 10px',
                  fontSize: 13,
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={loading || (!input.trim() && !imagePreview)}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: (loading || (!input.trim() && !imagePreview)) ? '#e2e8f0' : 'linear-gradient(135deg, #1b4fd8 0%, #2563eb 100%)',
                  color: 'white', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: (loading || (!input.trim() && !imagePreview)) ? 'not-allowed' : 'pointer'
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── FLOATING BUTTON (FAB) ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1b4fd8 0%, #4f46e5 100%)',
          color: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 18px rgba(27,79,216,0.35)',
          transition: 'transform 200ms ease-out, box-shadow 200ms',
          position: 'relative'
        }}
        className="anim-float"
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(27,79,216,0.45)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 18px rgba(27,79,216,0.35)';
        }}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        
        {/* Pulsing indicator */}
        {!isOpen && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 14, height: 14, borderRadius: '50%',
            background: '#4ade80', border: '2.5px solid white',
            boxShadow: '0 0 0 2px rgba(74,222,128,0.4)',
            animation: 'ping 1.5s infinite'
          }} />
        )}
      </button>

      {/* Embedded inline styles for simple animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        @keyframes ping {
          0% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(74, 222, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
          }
        }
      `}</style>
    </div>
  );
}
