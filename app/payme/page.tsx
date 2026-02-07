import type { Metadata } from 'next'
import PayMeContent from './content'

export const metadata: Metadata = {
  title: 'Payment Options — Vlad Tamas',
  description: 'Send a payment via Wise, Revolut, or bank transfer.',
  openGraph: {
    title: 'Payment Options',
    description: 'Send a payment via Wise, Revolut, or bank transfer.',
    url: 'https://www.vladtamas.com/payme',
    siteName: 'Vlad Tamas',
    images: [
      {
        url: '/og-payme.png',
        width: 1200,
        height: 630,
        alt: 'Payment Options — Vlad Tamas',
      },
    ],
    type: 'website',
  },
}

export default function PayMePage() {
  return <PayMeContent />
}
