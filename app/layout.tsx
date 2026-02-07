import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vlad Tamas',
  description: 'Personal website of Vlad Tamas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
