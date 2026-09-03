import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono, Caveat } from 'next/font/google';
import '@/styles/globals.scss';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-handwriting',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SOMO — First see it, then make it!',
  description: 'Craft your website design language and visual system before writing code.',
  icons: {
    icon: '/logos/logo_nobg.png',
    shortcut: '/logos/logo_nobg.png',
    apple: '/logos/logo_nobg.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${fraunces.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
