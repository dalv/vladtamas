'use client'

import { useEffect } from 'react'

type Instance = { destroy?: () => void }
type Engine = { mount: (root: Element) => Instance; reduce: boolean }

declare global {
  interface Window {
    ScrollCraft?: Engine
  }
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

function loadEngine(): Promise<Engine> {
  if (window.ScrollCraft) return Promise.resolve(window.ScrollCraft)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = '/scrollcraft.js'
    s.async = true
    s.onload = () => (window.ScrollCraft ? resolve(window.ScrollCraft) : reject())
    s.onerror = reject
    document.head.appendChild(s)
  })
}

export default function Motion() {
  useEffect(() => {
    let instance: Instance | undefined
    let raf = 0
    let alive = true
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    const act = document.querySelector<HTMLElement>('[data-fold-act]')
    const fold = document.querySelector<HTMLElement>('[data-fold]')
    const readout = document.querySelector<HTMLElement>('[data-readout]')
    const live = document.querySelector<HTMLElement>('[data-live]')
    const toggle = document.querySelector<HTMLButtonElement>('[data-live-toggle]')
    const nav = document.querySelector<HTMLElement>('[data-nav]')
    const links = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-link]'))
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'))

    /* ---- The fold: geometry is measured once per resize, in px. ---------- */
    let geo = { W: 0, Hd: 0, Hp: 0, Wp: 0, bar: 32 }
    const measure = () => {
      if (!fold) return
      const phone = innerWidth < 860
      const W = fold.clientWidth
      const bar = phone ? 22 : 32
      const Hd = W * 0.625 + bar
      const target = phone ? Math.min(innerHeight * 0.46, innerHeight - (innerHeight < 700 ? 440 : 400)) : innerHeight * 0.64
      const Hp = Math.max(Hd + (phone ? 24 : 48), Math.min(target, W * (phone ? 1.4 : 1.05)))
      const Wp = Math.min(W, Hp * 0.47)
      geo = { W, Hd, Hp, Wp, bar }
      const s = fold.style
      s.setProperty('--W', `${W}px`)
      s.setProperty('--Hd', `${Hd}px`)
      s.setProperty('--Hp', `${Hp}px`)
      s.setProperty('--Wp', `${Wp}px`)
      s.setProperty('--bar', `${bar}px`)
      sizeLive()
    }

    // The live iframe renders the real site at a true phone width (390px),
    // then scales down to the drawn phone screen.
    const sizeLive = () => {
      if (!live) return
      const inset = 7
      const sw = geo.Wp - inset * 2
      const sh = geo.Hp - inset * 2
      const k = sw / 390
      live.style.setProperty('--live-k', String(k))
      live.style.setProperty('--live-h', `${sh / k}px`)
    }

    let lastQ = -1
    let lastSection = '-'
    let lastScrolled: boolean | null = null
    const frame = () => {
      if (!alive) return
      raf = requestAnimationFrame(frame)

      if (act && fold) {
        const p = parseFloat(act.style.getPropertyValue('--sc-p')) || 0
        let q = clamp((p - 0.16) / 0.52)
        if (reduce) q = q < 0.5 ? 0 : 1
        if (Math.abs(q - lastQ) > 0.0005) {
          lastQ = q
          const eased = 1 - Math.pow(1 - q, 3)
          const mix = clamp((q - 0.42) / 0.3)
          fold.style.setProperty('--q', eased.toFixed(4))
          fold.style.setProperty('--mix', mix.toFixed(4))
          fold.classList.toggle('is-phone', q > 0.97)
          if (readout) readout.textContent = String(Math.round(1440 - (1440 - 390) * eased))
          if (q < 0.9 && live && !live.hidden) closeLive()
        }
      }

      // Nav: solid once the page has moved; current section highlighted.
      const scrolled = scrollY > 12
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled
        nav?.classList.toggle('is-scrolled', scrolled)
      }
      const y = innerHeight * 0.4
      let current = ''
      for (const sec of sections) if (sec.getBoundingClientRect().top <= y) current = sec.dataset.section ?? ''
      if (current !== lastSection) {
        lastSection = current
        for (const l of links) {
          const on = l.dataset.navLink === current
          l.classList.toggle('is-current', on)
          if (on) l.setAttribute('aria-current', 'true')
          else l.removeAttribute('aria-current')
        }
      }
    }

    /* ---- Try it live --------------------------------------------------- */
    const openLive = () => {
      if (!live || !toggle) return
      if (!live.firstChild) {
        const f = document.createElement('iframe')
        f.src = 'https://www.acrovents.com'
        f.title = 'Acro Events, live'
        f.loading = 'lazy'
        f.setAttribute('referrerpolicy', 'no-referrer')
        live.appendChild(f)
      }
      live.hidden = false
      fold?.classList.add('is-live')
      toggle.textContent = 'Back to the capture'
      toggle.setAttribute('aria-pressed', 'true')
    }
    const closeLive = () => {
      if (!live || !toggle) return
      live.hidden = true
      fold?.classList.remove('is-live')
      toggle.textContent = 'Try it live'
      toggle.setAttribute('aria-pressed', 'false')
    }
    const onToggle = () => (live?.hidden ? openLive() : closeLive())
    toggle?.addEventListener('click', onToggle)
    toggle?.setAttribute('aria-pressed', 'false')

    measure()
    addEventListener('resize', measure)
    document.fonts?.ready.then(measure)

    loadEngine()
      .then((engine) => {
        if (!alive) return
        instance = engine.mount(document.body)
        raf = requestAnimationFrame(frame)
      })
      .catch(() => {
        document.documentElement.classList.add('no-engine')
        raf = requestAnimationFrame(frame)
      })

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      removeEventListener('resize', measure)
      toggle?.removeEventListener('click', onToggle)
      instance?.destroy?.()
    }
  }, [])

  return null
}
