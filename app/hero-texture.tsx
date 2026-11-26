'use client'

import { useEffect, useRef } from 'react'

/*
  Cursor-reactive dot texture behind the hero, drawn on one canvas.
  A fine grid of faint dots; dots near the cursor grow, turn blue and ease
  slightly away from it. Touch screens get a slow drifting focus point
  instead. Reduced motion draws one still frame. The loop only runs while
  the hero is on screen and the tab is visible.
*/

const BLUE = [37, 99, 235]
const INK = [17, 18, 20]
const GAP = 20 // px between dots
const R = 250 // cursor influence radius, px
// How strongly dots react under the cursor (0 = not at all).
const HOVER_GROW = 0.4 // extra radius, px (resting radius is 1px)
const HOVER_ALPHA = 0.52 // extra opacity on top of the resting 0.14
const HOVER_PUSH = 3 // px the dots ease away from the cursor
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

export default function HeroTexture() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches

    let W = 0, H = 0
    let raf = 0, running = false, visible = true
    const target = { x: -9999, y: -9999, on: false } // raw pointer
    const cur = { x: -9999, y: -9999, a: 0 } // smoothed pointer + presence

    const size = () => {
      const r = host.getBoundingClientRect()
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height))
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const ox = ((W / 2) % GAP) - GAP / 2, oy = GAP / 2
      for (let y = oy; y < H; y += GAP) {
        for (let x = ox; x < W; x += GAP) {
          const dx = x - cur.x, dy = y - cur.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const k = cur.a * clamp(1 - dist / R) ** 2
          const push = k * HOVER_PUSH
          const px = x + (dist ? (dx / dist) * push : 0)
          const py = y + (dist ? (dy / dist) * push : 0)
          const [r, g, b] = mix(INK, BLUE, k)
          ctx.fillStyle = `rgb(${r} ${g} ${b} / ${0.14 + k * HOVER_ALPHA})`
          ctx.beginPath(); ctx.arc(px, py, 1 + k * HOVER_GROW, 0, Math.PI * 2); ctx.fill()
        }
      }
    }

    const frame = (now: number) => {
      // Touch devices: a slow wandering focus point so phones still get the effect.
      if (!finePointer && !reduce) {
        const s = now / 1000
        // Stays in the upper band around the photo, away from the body text.
        target.x = W * (0.5 + 0.42 * Math.sin(s * 0.23))
        target.y = H * (0.2 + 0.08 * Math.sin(s * 0.31 + 1))
        target.on = true
      }
      const e = reduce ? 1 : 0.12
      if (target.on) {
        if (cur.x < -9000) { cur.x = target.x; cur.y = target.y }
        cur.x += (target.x - cur.x) * e; cur.y += (target.y - cur.y) * e
      }
      cur.a += ((target.on ? 1 : 0) - cur.a) * (reduce ? 1 : 0.06)
      draw()
      if (running && !reduce) raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running || reduce || !visible || document.hidden) return
      running = true; raf = requestAnimationFrame(frame)
    }
    const stop = () => { running = false; cancelAnimationFrame(raf) }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      const r = canvas.getBoundingClientRect()
      target.x = e.clientX - r.left; target.y = e.clientY - r.top
      target.on = target.y > -40 && target.y < H + 40
      if (reduce) frame(performance.now())
    }
    const onLeave = () => { target.on = false }

    size()
    const ro = new ResizeObserver(() => { size(); if (!running) frame(performance.now()) })
    ro.observe(host)
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; visible ? start() : stop() })
    io.observe(host)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    if (finePointer) {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
    }

    frame(performance.now())
    start()

    return () => {
      stop(); ro.disconnect(); io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className="hero-texture" aria-hidden="true" />
}
