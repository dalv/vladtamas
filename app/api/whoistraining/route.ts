import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

const KEY_PREFIX = 'whoistraining:'

function keyForDate(dateStr?: string) {
  if (dateStr) return KEY_PREFIX + dateStr
  return KEY_PREFIX + new Date().toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const date = url.searchParams.get('date') || undefined
    const key = keyForDate(date)
    const data = (await kv.get(key)) || []
    return NextResponse.json({ ok: true, entries: data })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, start, end } = body
    if (!name || !start || !end) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }
    const key = keyForDate()
    const existing = (await kv.get(key)) || []
    const entry = {
      id: String(Date.now()),
      name: String(name),
      start: String(start),
      end: String(end),
      createdAt: Date.now(),
    }
    const updated = [...existing, entry].sort((a: any, b: any) => a.start.localeCompare(b.start))
    await kv.set(key, updated)
    return NextResponse.json({ ok: true, entries: updated })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 })
    const key = keyForDate()
    const existing = (await kv.get(key)) || []
    const updated = existing.filter((e: any) => e.id !== id)
    await kv.set(key, updated)
    return NextResponse.json({ ok: true, entries: updated })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
