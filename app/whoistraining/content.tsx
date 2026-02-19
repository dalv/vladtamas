"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

type Entry = {
  id: string
  name: string
  start: string // HH:MM
  end: string // HH:MM
  createdAt: number
}

const STORAGE_PREFIX = 'whoistraining:'

function todayKey(date = new Date()) {
  return STORAGE_PREFIX + date.toISOString().slice(0, 10)
}

function initials(name: string) {
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function WhoIsTrainingContent() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [name, setName] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Try server API first; fall back to localStorage if API fails or not configured
  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/whoistraining')
        if (!res.ok) throw new Error('API error')
        const json = await res.json()
        if (mounted && json?.ok) {
          setEntries(json.entries || [])
          return
        }
      } catch (err) {
        // fallback to localStorage
        const raw = localStorage.getItem(todayKey())
        if (raw) {
          try {
            const parsed: Entry[] = JSON.parse(raw)
            setEntries(parsed)
          } catch (e) {
            setEntries([])
          }
        }
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // keep localStorage in sync as a fallback / offline cache
  useEffect(() => {
    try {
      localStorage.setItem(todayKey(), JSON.stringify(entries))
    } catch (e) {
      // ignore
    }
  }, [entries])

  async function addEntry(e?: React.FormEvent) {
    e?.preventDefault()
    if (!name.trim() || !start || !end) return
    const payload = { name: name.trim(), start, end }
    try {
      const res = await fetch('/api/whoistraining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const json = await res.json()
        if (json?.ok) {
          setEntries(json.entries || [])
        }
      } else {
        throw new Error('Network')
      }
    } catch (err) {
      // offline / API not available: update local state and localStorage
      const newEntry: Entry = {
        id: String(Date.now()),
        name: name.trim(),
        start,
        end,
        createdAt: Date.now(),
      }
      setEntries((s) => [...s, newEntry].sort((a, b) => a.start.localeCompare(b.start)))
    }

    setName('')
    setStart('')
    setEnd('')
    setShowForm(false)
  }

  async function removeEntry(id: string) {
    try {
      const res = await fetch('/api/whoistraining', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        const json = await res.json()
        if (json?.ok) {
          setEntries(json.entries || [])
          return
        }
      }
    } catch (err) {
      // fallback below
    }
    setEntries((s) => s.filter((x) => x.id !== id))
  }

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Who is training today</h1>
          <p className="text-muted-foreground mt-1">See who from the house plans to train today — join up if you want company.</p>
        </div>

        <div className="space-y-4">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base">Today — {new Date().toLocaleDateString()}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {entries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No one has announced training today yet.</p>
              ) : (
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 text-sm font-semibold text-foreground">{initials(entry.name)}</div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{entry.name}</div>
                          <div className="text-xs text-muted-foreground">{formatTimeRange(entry.start, entry.end)}</div>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => removeEntry(entry.id)}
                          className="text-xs text-muted-foreground hover:text-red-500"
                          aria-label={`Remove ${entry.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              {showForm ? (
                <form onSubmit={addEntry} className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 bg-background text-foreground"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Start</label>
                      <input
                        type="time"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="w-full rounded-md border px-3 py-2 bg-background text-foreground"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">End</label>
                      <input
                        type="time"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="w-full rounded-md border px-3 py-2 bg-background text-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button type="submit">Announce training</Button>
                    <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <Button onClick={() => setShowForm(true)}>Me 🙋‍♂️</Button>
                  <Button variant="ghost" onClick={() => copyShareText(entries)}>Share</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

function formatTimeRange(start: string, end: string) {
  try {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    const s = new Date()
    s.setHours(sh, sm, 0, 0)
    const e = new Date()
    e.setHours(eh, em, 0, 0)
    return `${s.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${e.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
  } catch (e) {
    return `${start} - ${end}`
  }
}

function copyShareText(entries: Entry[]) {
  const header = `Who's training today (${new Date().toLocaleDateString()}):\\n`;
  if (!entries.length) {
    navigator.clipboard.writeText(header + 'No one yet')
    return
  }
  const lines = entries.map((e) => `- ${e.name}: ${formatTimeRange(e.start, e.end)}`)
  navigator.clipboard.writeText(header + lines.join('\\n'))
}
