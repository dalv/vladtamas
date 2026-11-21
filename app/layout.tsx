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
  icons: {
    icon:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%23f4f5f7'/><path d='M8 9l5 14 5-14M17 9h8M21 9v14' stroke='%23050506' stroke-width='2.4' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>",
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
