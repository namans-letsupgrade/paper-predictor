'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, User, Menu, X } from 'lucide-react';

export default function Navbar() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner" style={{ position: 'relative' }}>
        {/* Logo */}
        <Link href="/" className="navbar-logo" style={{ gap: 0 }}>
          <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--gray-900)' }}>
            Paper<span style={{ color: 'var(--brand-primary)' }}>Predictor</span>.com
          </span>
        </Link>

        {/* Nav links (Desktop only) */}
        <div className="navbar-links">
          {[
            { label: 'Boards',      href: '/boards' },
            { label: 'AI Solver ✦',  href: '/chatbot' },
            { label: 'Pricing',     href: '/pricing' },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`nav-link${path === l.href ? ' active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Action button container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Desktop Actions */}
          <div className="navbar-actions-desktop" style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              href="#"
              className="btn btn-primary"
              style={{
                height: 40,
                borderRadius: 8,
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
                fontWeight: 600,
                boxShadow: 'none'
              }}
            >
              <User size={15} strokeWidth={2.5} />
              Login
            </Link>
          </div>

          {/* Mobile Profile Avatar icon (only visible on mobile viewports) */}
          <div className="mobile-profile-avatar">
            <Link href="/dashboard/predictions" aria-label="Go to Dashboard">
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-accent))',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(27,79,216,0.25)',
                cursor: 'pointer'
              }}>
                SP
              </div>
            </Link>
          </div>

          {/* Hamburger Icon */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 8,
              background: 'var(--gray-100)',
              color: 'var(--gray-700)',
              cursor: 'pointer',
              border: 'none',
              transition: 'background 200ms'
            }}
          >
            {isOpen ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Mobile Menu Drawer Overlay */}
        {isOpen && (
          <div
            className="mobile-menu-overlay"
            style={{
              position: 'fixed',
              top: 64,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'white',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 20px',
              gap: 12,
              animation: 'fadeInUp 200ms ease both'
            }}
          >
            {[
              { label: 'Boards',      href: '/boards' },
              { label: 'AI Solver ✦',  href: '/chatbot' },
              { label: 'Pricing',     href: '/pricing' },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setIsOpen(false)}
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: path === l.href ? 'var(--brand-primary)' : 'var(--gray-700)',
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: path === l.href ? 'var(--brand-primary-light)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  height: 48,
                  transition: 'all 200ms'
                }}
              >
                {l.label}
              </Link>
            ))}

            <div style={{ height: 1, background: 'var(--gray-100)', margin: '12px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link
                href="#"
                onClick={() => setIsOpen(false)}
                className="btn btn-primary btn-full"
                style={{ height: 48, justifyContent: 'center', gap: 8 }}
              >
                <User size={16} strokeWidth={2.5} />
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

