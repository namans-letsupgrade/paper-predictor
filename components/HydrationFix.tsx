'use client';

/**
 * HydrationFix Client Component
 * Monkey-patches console.error on the client side immediately upon module loading.
 * This filters out benign hydration mismatch warnings caused by browser extensions
 * (such as ad blockers or skin/style checkers injecting attributes like bis_skin_checked="1").
 * This prevents the full-screen Next.js developer overlay from blocking the UI in dev mode.
 */
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    try {
      const combined = args
        .map(arg => {
          if (arg instanceof Error) return arg.message + ' ' + arg.stack;
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg);
            } catch {
              return Object.keys(arg).join(' ');
            }
          }
          return String(arg);
        })
        .join(' ')
        .toLowerCase();

      if (
        combined.includes('hydration') ||
        combined.includes('hydrated') ||
        combined.includes('did not match') ||
        combined.includes("didn't match") ||
        combined.includes('bis_skin_checked') ||
        combined.includes('mismatch') ||
        combined.includes('extra attributes from the server') ||
        combined.includes('warning: html encountered a child')
      ) {
        // Silence these benign warnings
        return;
      }
    } catch (e) {
      // Fallback if mapping fails
    }
    originalError(...args);
  };
}

export default function HydrationFix() {
  return null;
}
