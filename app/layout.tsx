import { AuthProvider } from '@/components/auth-provider';
import type { Metadata } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { demoMode, siteUrl } from '@/lib/config';
import './globals.css';
import './editorial.css';
const dm = DM_Sans({ subsets: ['latin'], variable: '--font-dm' });
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-syne',
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'SharpAndLean — Know what goes in.', template: '%s | SharpAndLean' },
  description:
    'Thoughtful supplement reviews for weight management, cognitive health and everyday wellness.',
  icons: {
    icon: '/favicon.svg',
    apple: '/images/logo.png',
  },
  robots: demoMode ? { index: false, follow: false } : undefined,
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dm.variable} ${syne.variable}`}>
        <AuthProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          {children}
          {process.env.VERCEL && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  );
}
