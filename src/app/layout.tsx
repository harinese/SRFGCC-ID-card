import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SRFGCC Student ID Card Portal',
  description: 'Official Student Identity Card Portal for Sangolli Rayanna First Grade Constituent College, Belagavi',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <footer
          className="no-print"
          style={{
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.5rem 1rem',
            textAlign: 'center',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <p>
            Sangolli Rayanna First Grade Constituent College, Belagavi
          </p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Affiliated with Rani Channamma University &bull; Mal Maruti Extension, Belagavi - 590 017
          </p>
        </footer>
      </body>
    </html>
  );
}
