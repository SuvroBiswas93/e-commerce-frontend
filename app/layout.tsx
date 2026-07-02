import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'ShopHub - Your Favorite E-Commerce Store',
    template: '%s | ShopHub',
  },
  description:
    'Discover amazing products with a seamless shopping experience. Browse, filter, and shop with confidence.',
  applicationName: 'ShopHub',
  keywords: ['ecommerce', 'shopping', 'products'],
  authors: [{ name: 'ShopHub' }],
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'ShopHub',
    title: 'ShopHub - Your Favorite E-Commerce Store',
    description:
      'Discover amazing products with a seamless shopping experience.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopHub - Your Favorite E-Commerce Store',
    description:
      'Discover amazing products with a seamless shopping experience.',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`bg-background ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
