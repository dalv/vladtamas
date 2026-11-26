# vladtamas.com portfolio: brief

**Self-authored under explicit creative delegation.** Vlad asked to "revamp this
website using the scroll-craft skill" so it looks "a little more professional",
showcasing one project (https://www.acrovents.com), removing the old tools
(Send Payment, Who Is Training, Latihan), and deploying. The only interview
answer collected: contact link is `vlad.tamas@gmail.com`. Everything else below
is an authored decision, not a quotation.

## The eight topics

1. **Vibe.** Calm, precise, quietly confident. References: a printed type
   specimen, a museum wall label, a well-made app settings screen.
2. **Journey.** Who he is. The work. How the work holds up on every screen.
   How he works. How to reach him.
3. **Energy.** Quiet open, one loud moment in the middle (the work), quiet close.
4. **Feeling + the one moment.** See curve below. Peak: the Acro Events site
   folds from a desktop browser into a phone under your scroll.
5. **What no other site does.** The portfolio proves "web and mobile" by
   physically folding the real project from one into the other, then handing
   you the live site to try in place.
6. **Range.** Editorial, light paper ground. Deliberately the opposite of the
   showcased site (dark, gradient) so the work is the only dark thing on the page.
7. **One world or distinct scenes.** Distinct chapters with hard cuts.
8. **Assets.** None supplied. Real screenshots of acrovents.com captured with
   headless Chrome at 1440x900 and 390x844. No generated imagery, no spend.

Evidence vs assumption: Acro Events facts (name, Thailand 2025 intensive,
Next.js on Vercel) are read from the live site. "Design and development" as
Vlad's role on it is an **assumption** to confirm.

## Grammar: Chaptered editorial

A portfolio with one project cannot be a gallery (a collection of one is not a
collection). Live surface needs a product that is the pitch; split stage needs
a two-sided argument; continuous world needs geography; cutlist needs an
energy brand; typographic poster wastes the one real asset; filmic one-shot is
the prior default. Editorial fits a person introducing their work in prose,
and its title-page hero keeps the screenshot below the fold so the fold-in
lands as a reveal.

## Feeling curve

```
1  Clarity      title page: the name, one sentence, paper and type only
2  Anticipation hard cut to the chapter one intertitle, full-bleed dark ground
3  Delight      PEAK. desktop browser folds into a phone, layout reflows, then it goes live
4  Trust        how he works: plain prose beside both screens drifting at different depths
5  Resolve      colophon plate, the email as a line of running text, holds
```

**Peak:** "the project shrank from a laptop into a phone while I scrolled, and
then I could actually use it." Lives in act 3, largest span (3.2vh).

**It's the site where** his project folds from a laptop into a phone under your
scroll, and then you can try the real thing right there.

**Authored silence:** the intertitle (act 2) is deliberately sparse.

## Score

| Beat | Device | Why |
|---|---|---|
| Who | `flow` + `in` | Title page. Nothing moves but the type arriving |
| Chapter cut | `reveal` (up) | A wipe is a change of state: paper to the work's ground |
| The work (peak) | `pin` + bespoke fold | The frame holds, the device changes shape |
| How he works | `parallax` in media column | Two screens at two depths beside still prose |
| Close | `reveal` (iris) on colophon plate | The page arrives and stops |

Families: flow/in, reveal, pin, parallax (4). No adjacent repeats. No scrub.
Total about 8 viewport-heights across 5 acts.

## Signature move

**The fold.** A device frame clip-path-morphs from a 16:10 browser to a 9:19.5
phone, driven from `--sc-p`. The desktop capture shrinks with it, then
crossfades to the true mobile capture (the reflow), while a margin readout
counts the real capture widths 1440 to 390. At rest the phone offers "Try it
live", which swaps in the real acrovents.com in an iframe.

## Revision 2 (2026-11-21): restyled after a user reference

Vlad asked to bring in the look of https://aiautomationsociety.ai. Adopted its
style language only (no artwork, logo or copy): near-black ground (#050506),
dusk-blue gradients, Montserrat with Roboto Mono labels, pill badges with a
blue dot, two-tone headings, sticky blurred pill nav, bordered dark cards in a
bento, a bright gradient contact panel and a column footer. The editorial
title page, intertitle wipe and margin folio were replaced by a centred hero
with the work rising from the horizon. The fold (signature move) is unchanged
and now sits in a dusk-lit panel.

## Revision 3 (2026-11-26): flat and light

Vlad found the dark blue gradient look too much and asked for flatter and more
modern. Removed every gradient, glow, grain layer and drop shadow; surfaces are
now solid with 1px hairlines, 16px corners, a light neutral ground (#f6f6f7),
white cards and one blue accent (#2563eb, deeper #1d4ed8 for the contact
panel). Chosen over a dark-neutral flat alternative after a side-by-side
mock. All colours live in one token block at the top of globals.css.
