import type { Metadata } from 'next'
import WhoIsTrainingContent from './content'

export const metadata: Metadata = {
  title: 'Who is training today — Vlad Tamas',
  description: 'See who from the house is planning to train today and announce your own session.',
  openGraph: {
    title: 'Who is training today',
    description: 'See who from the house is planning to train today and announce your own session.',
    url: 'https://www.vladtamas.com/whoistraining',
    siteName: 'Vlad Tamas',
    images: [
      {
        url: '/og-whoistraining.png',
        width: 1200,
        height: 630,
        alt: 'Who is training today — Vlad Tamas',
      },
    ],
    type: 'website',
  },
}

export default function WhoIsTrainingPage() {
  return <WhoIsTrainingContent />
}
