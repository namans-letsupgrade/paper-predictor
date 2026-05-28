'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, X, ChevronDown, ChevronUp, Sparkles, HelpCircle, Shield, ArrowRight, Zap, Crown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'How accurate are the paper predictions?',
    a: 'Our AI models analyze the last 5 years of board exams, syllabus changes, and textbook topics to predict high-probability questions. While we cannot guarantee exact matches, historical data shows up to 80-85% similarity in terms of question types, difficulty, and topic distribution.'
  },
  {
    q: 'Can I download the predicted paper as a PDF?',
    a: 'Yes! Once you unlock a paper (via a single unlock or a Pro subscription), you get access to high-quality, printable PDF downloads for both the question paper and its detailed step-by-step solutions.'
  },
  {
    q: 'What is the refund policy?',
    a: 'Because our prediction reports are digital goods generated instantly, we do not offer refunds. However, if you experience any technical issues or are dissatisfied, please write to us, and we will do our best to resolve it.'
  },
  {
    q: 'Is the payment gateway secure?',
    a: 'Absolutely. We partner with Razorpay, India\'s leading payment platform, to process all transactions securely. We support UPI (Google Pay, PhonePe, Paytm), Net Banking, Credit/Debit cards, and popular mobile wallets.'
  },
  {
    q: 'How long will I have access to my unlocked paper?',
    a: 'A Single Paper unlock grants full access to that specific subject prediction for 60 days. The Pro Plan grants unlimited access to all subjects and predictions for as long as your subscription is active.'
  },
  {
    q: 'Can I regenerate a paper if I want a different set of questions?',
    a: 'Yes! Single Paper unlocks include 3 paper regenerations (e.g., to generate a harder version or target specific weak areas). Pro Plan members get 5 regenerations per subject per month.'
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--gray-50)' }}>
        {/* Hero Section */}
        <section className="section-sm" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative blobs */}
          <div className="hero-blob hero-blob-1" style={{ top: -100, right: '10%' }} />
          <div className="hero-blob hero-blob-2" style={{ bottom: -50, left: '10%' }} />

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <span className="section-pill">
              💰 Student-Friendly Plans
            </span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              color: 'var(--gray-900)',
              letterSpacing: '-0.025em',
              marginBottom: 12,
              lineHeight: 1.15
            }}>
              Simple, Student-Friendly Pricing
            </h1>
            <p style={{
              fontSize: 16,
              color: 'var(--gray-500)',
              maxWidth: 580,
              margin: '0 auto 28px',
              lineHeight: 1.6
            }}>
              No subscriptions required if you want to pay as you go. Select a plan that fits your preparation needs.
            </p>

            {/* Billing Toggle */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--gray-100)',
              border: '1px solid var(--gray-200)',
              borderRadius: 9999,
              padding: 4,
              marginBottom: 16
            }}>
              <button
                onClick={() => setBillingPeriod('monthly')}
                style={{
                  padding: '8px 20px',
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 200ms',
                  background: billingPeriod === 'monthly' ? 'white' : 'transparent',
                  color: billingPeriod === 'monthly' ? 'var(--gray-900)' : 'var(--gray-500)',
                  boxShadow: billingPeriod === 'monthly' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                style={{
                  padding: '8px 20px',
                  borderRadius: 9999,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 200ms',
                  background: billingPeriod === 'annual' ? 'white' : 'transparent',
                  color: billingPeriod === 'annual' ? 'var(--gray-900)' : 'var(--gray-500)',
                  boxShadow: billingPeriod === 'annual' ? 'var(--shadow-sm)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <span>Annual</span>
                <span style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontSize: 9,
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: 9999
                }}>
                  Save 30%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section style={{ paddingBottom: 64 }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
              alignItems: 'stretch',
              maxWidth: 1100,
              margin: '0 auto'
            }}>
              {/* Card 1: Free */}
              <div className="card" style={{
                background: 'white',
                borderRadius: 20,
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-card)',
                transition: 'transform 200ms, box-shadow 200ms'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--gray-500)' }}>
                      Always Free
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 18 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 900, color: 'var(--gray-900)' }}>₹0</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 24 }}>
                    Ideal for exploring historical paper weightage and syllabus topics.
                  </p>

                  <div style={{ height: 1, background: 'var(--gray-100)', marginBottom: 24 }} />

                  {/* Features */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
                    {[
                      { yes: true, text: 'View past papers (5 years)' },
                      { yes: true, text: 'Analytics overview' },
                      { yes: true, text: '5 preview questions per prediction' },
                      { yes: true, text: 'Syllabus access' },
                      { yes: false, text: 'Full predicted paper' },
                      { yes: false, text: 'Answer key' },
                      { yes: false, text: 'PDF download' },
                      { yes: false, text: 'Regenerations' }
                    ].map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 13, color: f.yes ? 'var(--gray-700)' : 'var(--gray-400)' }}>
                        {f.yes ? (
                          <Check size={16} color="var(--success)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        ) : (
                          <X size={16} color="var(--danger)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        )}
                        <span style={{ textDecoration: f.yes ? 'none' : 'line-through' }}>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button style={{
                  width: '100%',
                  height: 44,
                  background: 'var(--gray-100)',
                  color: 'var(--gray-800)',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  transition: 'all 200ms'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-200)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--gray-100)'}
                >
                  Get Started Free
                </button>
              </div>

              {/* Card 2: Single Paper (Highlight Border) */}
              <div className="card" style={{
                background: 'white',
                borderRadius: 20,
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '2px solid var(--brand-primary)',
                boxShadow: 'var(--shadow-md)',
                transform: 'scale(1.02)',
                position: 'relative',
                transition: 'transform 200ms, box-shadow 200ms'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04) translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
              >
                {/* Popular Badge */}
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--brand-primary)',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '4px 14px',
                  borderRadius: 9999,
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 12px rgba(27,79,216,0.25)'
                }}>
                  🔥 Most Popular
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-primary)' }}>
                      Pay Per Use
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 18 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 900, color: 'var(--gray-900)' }}>₹99</span>
                    <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>/ paper</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 24 }}>
                    Ideal for students wanting to test themselves on a specific subject before their exam.
                  </p>

                  <div style={{ height: 1, background: 'var(--gray-100)', marginBottom: 24 }} />

                  {/* Features */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
                    {[
                      'Full predicted paper (all 32 Qs)',
                      'Complete step-by-step solutions',
                      'High-quality PDF download',
                      '3 paper regenerations included',
                      '60 days full validity access',
                      'Confidence metric for every question',
                      'Chapter & topic mapping badges'
                    ].map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 13, color: 'var(--gray-700)' }}>
                        <Check size={16} color="var(--success)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button style={{
                  width: '100%',
                  height: 44,
                  background: 'var(--grad-blue)',
                  color: 'white',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-blue)',
                  transition: 'all 200ms'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1440B0, #122F8A)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--grad-blue)'}
                >
                  Unlock Paper for ₹99
                </button>
              </div>

              {/* Card 3: Pro Plan */}
              <div className="card" style={{
                background: 'white',
                borderRadius: 20,
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-card)',
                transition: 'transform 200ms, box-shadow 200ms'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand-accent)' }}>
                      All Subjects
                    </span>
                    <span style={{
                      background: '#EEF2FF',
                      color: 'var(--brand-accent)',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      border: '1px solid #C7D2FE'
                    }}>
                      Best Value
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 18 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 900, color: 'var(--gray-900)' }}>
                      {billingPeriod === 'monthly' ? '₹199' : '₹999'}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>
                      {billingPeriod === 'monthly' ? '/ month' : '/ year'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 24 }}>
                    Perfect for board class students or JEE/NEET/MHT-CET premium aspirants.
                  </p>

                  <div style={{ height: 1, background: 'var(--gray-100)', marginBottom: 24 }} />

                  {/* Features */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
                    {[
                      'All subjects, all boards supported',
                      'Unlimited AI predictions',
                      'Unlimited PDF downloads',
                      '5 regenerations per subject',
                      'Step-by-step answer keys for all Qs',
                      'Chapter-wise prep guide access',
                      'Priority customer support',
                      'LetsUpgrade student community access'
                    ].map((f, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 13, color: 'var(--gray-700)' }}>
                        <Check size={16} color="var(--success)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button style={{
                  width: '100%',
                  height: 44,
                  border: '2px solid var(--brand-accent)',
                  background: 'white',
                  color: 'var(--brand-accent)',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  transition: 'all 200ms'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-primary-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
                >
                  Start Pro Plan
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section style={{ padding: '48px 0 80px', borderTop: '1px solid var(--gray-200)', background: 'white' }}>
          <div className="container-sm">
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--gray-900)',
                letterSpacing: '-0.02em',
                marginBottom: 10
              }}>
                Frequently Asked Questions
              </h2>
              <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
                Got questions? We have answers. Find everything you need to know about our plans.
              </p>
            </div>

            {/* Accordion List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    style={{
                      border: '1px solid var(--gray-200)',
                      borderRadius: 12,
                      background: isOpen ? 'var(--gray-50)' : 'white',
                      overflow: 'hidden',
                      transition: 'all 250ms ease-out'
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      style={{
                        width: '100%',
                        padding: '18px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-900)', paddingRight: 16 }}>
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp size={16} color="var(--gray-500)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      ) : (
                        <ChevronDown size={16} color="var(--gray-500)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      )}
                    </button>

                    <div style={{
                      maxHeight: isOpen ? '200px' : '0px',
                      overflow: 'hidden',
                      transition: 'max-height 250ms ease-out'
                    }}>
                      <div style={{
                        padding: '0 24px 20px',
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: 'var(--gray-500)'
                      }}>
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
