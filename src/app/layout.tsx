'use client';

import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { ThemeProvider } from './providers/ThemeProvider';
import LoaderWrapper from './components/LoaderWrapper';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <ThemeProvider>
          <LoaderWrapper loading={loading}>
            {children}
          </LoaderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}