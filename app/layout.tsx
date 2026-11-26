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
  title: 'Vlad Tamas · AI automation, web and mobile',
  description:
    'Vlad Tamas builds AI automations, websites and mobile apps that are simple, fast and a pleasure to use.',
  metadataBase: new URL('https://vladtamas.com'),
  openGraph: {
    title: 'Vlad Tamas · AI automation, web and mobile',
    description:
      'AI automations, websites and mobile apps. Selected work: Acro Events and DualCast Instant Replay.',
    url: 'https://vladtamas.com',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#f6f6f7',
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
