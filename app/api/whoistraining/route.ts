import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Note: We don't throw at import time to avoid crashing the dev server.
  console.warn('Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.')
}

function keyForDateStr(dateStr?: string) {
  if (dateStr) return dateStr
  return new Date().toISOString().slice(0, 10)
}

function supabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase environment variables missing')
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const date = keyForDateStr(url.searchParams.get('date') || undefined)
    const supabase = supabaseClient()
    const { data, error } = await supabase
      .from('whoistraining')
      .select('*')
      .eq('date', date)
      .order('start', { ascending: true })

    if (error) throw error
    return NextResponse.json({ ok: true, entries: data || [] })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, start, end, date } = body
    if (!name || !start || !end) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 })
    }
    const supabase = supabaseClient()
    const dateStr = keyForDateStr(date)
    const payload = { name: String(name), start: String(start), end: String(end), date: dateStr }
    const { data: inserted, error: insertErr } = await supabase.from('whoistraining').insert(payload).select()
    if (insertErr) throw insertErr

    // return all entries for the date
    const { data, error } = await supabase
      .from('whoistraining')
      .select('*')
      .eq('date', dateStr)
      .order('start', { ascending: true })

    if (error) throw error
    return NextResponse.json({ ok: true, entries: data || [] })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 })
    const supabase = supabaseClient()
    const { error } = await supabase.from('whoistraining').delete().eq('id', id)
    if (error) throw error

    // return remaining entries for today
    const dateStr = keyForDateStr()
    const { data, error: qerr } = await supabase
      .from('whoistraining')
      .select('*')
      .eq('date', dateStr)
      .order('start', { ascending: true })
    if (qerr) throw qerr
    return NextResponse.json({ ok: true, entries: data || [] })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
