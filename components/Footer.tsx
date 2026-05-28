import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-copy">
          © 2024 paperpredictor.com. All rights reserved.
        </span>
        <div className="footer-links-row">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms of Use</Link>
          <Link href="#">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
