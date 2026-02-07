'use client'

import Link from 'next/link'
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-2 inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium text-foreground ${mono ? 'font-mono' : ''} flex items-center`}>
        {value}
        {mono && <CopyButton text={value.replace(/\s/g, '')} />}
      </span>
    </div>
  )
}

export default function PayMeContent() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Payment
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose a method below
          </p>
        </div>

        <div className="space-y-4">
          {/* Wise */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#9fe870]/15">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#4a9c1d]" fill="currentColor">
                    <path d="M12.5 2L8 11h4l-1 11 8.5-13H15l2-7z" />
                  </svg>
                </div>
                <CardTitle className="text-base">Wise</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium">@vladt35</span>
                <a
                  href="https://wise.com/pay/me/vladt35"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Pay via Wise
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Revolut */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/5">
                  <span className="text-sm font-bold text-foreground">R</span>
                </div>
                <CardTitle className="text-base">Revolut</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium">@vladyv4a</span>
                <a
                  href="https://revolut.me/vladyv4a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Pay via Revolut
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* USD Bank Transfer */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <span className="text-sm font-semibold text-blue-600">$</span>
                </div>
                <CardTitle className="text-base">Bank Transfer — USD</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-0">
              <DetailRow label="Name" value="Vlad Tamas" />
              <Separator />
              <DetailRow label="Account number" value="8310103041" mono />
              <Separator />
              <DetailRow label="Account type" value="Checking" />
              <Separator />
              <DetailRow label="Routing (wire & ACH)" value="026073150" mono />
              <Separator />
              <DetailRow label="SWIFT / BIC" value="CMFGUS33" mono />
              <Separator />
              <div className="pt-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Community Federal Savings Bank, 89-16 Jamaica Ave, Woodhaven, NY, 11421, United States
                </p>
              </div>
            </CardContent>
          </Card>

          {/* EUR Bank Transfer */}
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                  <span className="text-sm font-semibold text-amber-600">€</span>
                </div>
                <CardTitle className="text-base">Bank Transfer — EUR</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-0">
              <DetailRow label="Name" value="Vlad Tamas" />
              <Separator />
              <DetailRow label="IBAN" value="BE08 9671 1047 8013" mono />
              <Separator />
              <DetailRow label="SWIFT / BIC" value="TRWIBEB1XXX" mono />
              <Separator />
              <div className="pt-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Wise, Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
