import type { Metadata, Viewport } from 'next'
import { Montserrat, Roboto_Mono } from 'next/font/google'
import './scrollcraft.css'
import './globals.css'

const sans = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

const mono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vlad Tamas · Web and mobile developer',
  description:
    'Vlad Tamas designs and builds websites and mobile apps that hold up on every screen.',
  metadataBase: new URL('https://vladtamas.com'),
  openGraph: {
    title: 'Vlad Tamas · Web and mobile developer',
    description:
      'Websites and mobile apps that hold up on every screen. Selected work: Acro Events.',
    url: 'https://vladtamas.com',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#050506',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
