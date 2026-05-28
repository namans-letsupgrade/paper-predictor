import type { Metadata } from 'next';
import './globals.css';
import MobileBottomNav from '@/components/MobileBottomNav';
import FloatingChatbot from '@/components/FloatingChatbot';
import HydrationFix from '@/components/HydrationFix';

export const metadata: Metadata = {
  title: 'PaperPredictor — AI-Powered Exam Prediction | CBSE, ICSE, JEE, NEET',
  description: 'Get AI-predicted exam papers based on 5 years of past paper analysis. CBSE, ICSE, JEE, NEET & MHT-CET. Chapter weightage, important topics, and section-wise predictions.',
  keywords: 'CBSE predicted paper, ICSE predicted paper, JEE prediction, NEET prediction, exam paper prediction, AI exam prediction, board exam preparation',
  authors: [{ name: 'PaperPredictor' }],
  openGraph: {
    title: 'PaperPredictor — Know What\'s Coming. Ace Your Exam.',
    description: 'AI-powered exam paper prediction based on 5-year pattern analysis.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <HydrationFix />
        {children}
        <MobileBottomNav />
        <FloatingChatbot />
      </body>
    </html>
  );
}
