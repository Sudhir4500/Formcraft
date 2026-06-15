import type { Metadata } from 'next'
import './globals.css'
import AuthHydrator from '@/components/auth/AuthHydrator';
import AuthWatcherClient from '@/components/AuthWatcherClient';

export const metadata: Metadata = {
  title: 'FormCraft',
  description: 'Build beautiful forms, collect responses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthHydrator />
        <AuthWatcherClient />
        {children}
      </body>
    </html>
  )
}