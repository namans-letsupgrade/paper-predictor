'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, FileText, BarChart3, User } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Show bottom nav only on authenticated / dashboard / predict / upload routes
  const isAuthPage = pathname.startsWith('/dashboard') || pathname.startsWith('/upload') || pathname.includes('/predict');

  useEffect(() => {
    if (isAuthPage) {
      document.body.classList.add('has-mobile-nav');
    } else {
      document.body.classList.remove('has-mobile-nav');
    }
    return () => {
      document.body.classList.remove('has-mobile-nav');
    };
  }, [isAuthPage]);

  if (!isAuthPage) return null;

  // Define tabs
  const tabs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Search', href: '/boards', icon: Search },
    { label: 'Papers', href: '/upload', icon: FileText },
    { label: 'Predictions', href: '/dashboard/predictions', icon: BarChart3 },
    { label: 'Profile', href: '/dashboard/predictions#profile', icon: User },
  ];

  return (
    <div
      className="mobile-only-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid #E5E7EB',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        const activeColor = 'var(--brand-primary)';
        const inactiveColor = 'var(--gray-500)';

        return (
          <Link
            key={tab.label}
            href={tab.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              gap: 4,
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            <Icon
              size={18}
              strokeWidth={isActive ? 2.5 : 2}
              color={isActive ? activeColor : inactiveColor}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? activeColor : inactiveColor,
                transition: 'color 200ms'
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
