import Motion from './motion'

const EMAIL = 'vlad.tamas@gmail.com'

export default function HomePage() {
  return (
    <>
      <span data-sc-progress aria-hidden="true" />
      <div className="sc-grain" aria-hidden="true" />

      {/* Folio: the page's only chrome. Name on the left, current chapter on the right. */}
      <header className="folio">
        <a className="folio__name" href="#top">Vlad Tamas</a>
        <p className="folio__chapter" aria-live="polite">
          <span className="folio__num" data-folio-num>Portfolio</span>
          <span className="folio__title" data-folio-title>2026</span>
        </p>
      </header>

      <main id="top">
        {/* 1 · Title page. Type on paper, no media above the fold. */}
        <section className="title" data-sc-act="flow" data-chapter="Portfolio|2026" data-ground="light">
          <div className="title__inner sc-wrap" data-sc-in data-sc-stagger="70">
            <p className="kicker">Web and mobile developer</p>
            <h1 className="title__name">Vlad Tamas</h1>
            <p className="title__lede">
              I design and build websites and mobile apps that feel quick, clear and
              considered on every screen.
            </p>
            <p className="title__links">
              <a className="btn btn--solid" href="#work">Selected work</a>
              <a className="btn btn--line" href={`mailto:${EMAIL}`}>Get in touch</a>
            </p>
          </div>
        </section>

        {/* 2 · Chapter one intertitle. A wipe from paper to the work's ground. */}
        <section id="work" className="intertitle" data-sc-act="flow" data-chapter="Chapter 1|Acro Events" data-ground="dark">
          <div className="intertitle__plate is-dark" data-sc-reveal="up" data-sc-reveal-at="0.06 0.42">
            <div className="intertitle__inner sc-wrap">
              <p className="kicker kicker--dark">Chapter one</p>
              <h2 className="intertitle__h">Acro Events</h2>
              <p className="intertitle__sub">
                A home for acrobatic workshops and gatherings around the world.
              </p>
            </div>
          </div>
        </section>

        {/* 3 · The fold (peak). Desktop browser folds into a phone under the scroll. */}
        <section className="case is-dark" data-sc-act="pin" data-sc-span="3.2" data-chapter="Chapter 1|Acro Events" data-ground="dark" data-fold-act>
          <div data-sc-stage className="case__stage">
            <div className="case__grid sc-wrap">
              <div className="case__copy">
                <p className="case__intro">
                  An events site for an acrobatics community: one strong identity, the
                  next gathering up front, and a direct line for collaborations.
                </p>
                <dl className="facts">
                  <div><dt>Client</dt><dd>Acro Events</dd></div>
                  <div><dt>Year</dt><dd>2025</dd></div>
                  <div><dt>Role</dt><dd>Design and development</dd></div>
                  <div><dt>Built with</dt><dd>Next.js, Vercel</dd></div>
                </dl>
                <p className="readout" aria-hidden="true">
                  <span className="readout__px" data-readout>1440</span>
                  <span className="readout__unit">px wide</span>
                </p>
                <a className="case__link" href="https://www.acrovents.com" target="_blank" rel="noopener">
                  Visit acrovents.com
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 11L11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>

              <figure className="fold" data-fold>
                <div className="fold__body">
                  <div className="fold__glass">
                    <div className="fold__bar" aria-hidden="true">
                      <i /><i /><i />
                      <span>acrovents.com</span>
                    </div>
                    <img
                      className="fold__desk"
                      src="/work/acro-desktop.webp"
                      width={1800}
                      height={1125}
                      alt="Acro Events home page in a desktop browser: the ACRO EVENTS wordmark over a dark gradient."
                    />
                    <img
                      className="fold__phone"
                      src="/work/acro-mobile.webp"
                      width={780}
                      height={1688}
                      alt="The same Acro Events page on a phone, with the layout reflowed for a narrow screen."
                    />
                    <span className="fold__island" aria-hidden="true" />
                    <div className="fold__live" data-live hidden />
                  </div>
                </div>
                <figcaption className="fold__cap">
                  <button type="button" className="btn btn--live" data-live-toggle>
                    Try it live
                  </button>
                  <span className="fold__note">Real captures at 1440 and 390 pixels.</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* 4 · How I work. Still prose beside two screens at two depths. */}
        <section className="method" data-sc-act="flow" data-chapter="Chapter 2|How I work" data-ground="light">
          <div className="method__grid sc-wrap">
            <div className="method__copy" data-sc-in data-sc-stagger="60">
              <h2 className="method__h">One product, every screen.</h2>
              <p className="method__p">
                Most people meet a product on their phone first and a laptop second. I
                plan for both from the first sketch, so each layout is written for its
                screen rather than squeezed onto it.
              </p>
              <dl className="offer">
                <div>
                  <dt>Websites</dt>
                  <dd>Marketing sites and web apps in React and Next.js, fast to load and easy to update.</dd>
                </div>
                <div>
                  <dt>Mobile apps</dt>
                  <dd>Apps and mobile-first interfaces that feel at home under a thumb.</dd>
                </div>
                <div>
                  <dt>Idea to live</dt>
                  <dd>Design, build and deploy in one pair of hands, so nothing gets lost between steps.</dd>
                </div>
              </dl>
            </div>
            <div className="method__media" aria-hidden="true">
              <div className="shot shot--desk" data-sc-parallax="0.9">
                <img src="/work/acro-desktop-full.webp" width={1440} height={1412} alt="" loading="lazy" />
              </div>
              <div className="shot shot--phone" data-sc-parallax="-1.3">
                <img src="/work/acro-mobile-full.webp" width={600} height={2203} alt="" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* 5 · Colophon. The page arrives and stops. */}
        <section id="contact" className="colophon" data-sc-act="flow" data-chapter="Contact|Vlad Tamas" data-ground="dark">
          <div className="colophon__plate is-dark" data-sc-reveal="iris" data-sc-reveal-at="0.04 0.36">
            <div className="colophon__inner sc-wrap">
              <h2 className="colophon__h">Have something in mind?</h2>
              <p className="colophon__p">
                Write to me at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and tell me what you are
                building. A website, an app, or just an idea you want a second opinion on.
              </p>
              <footer className="colophon__foot">
                <span>Vlad Tamas</span>
                <span>Web and mobile developer</span>
                <span>© 2026</span>
              </footer>
            </div>
          </div>
        </section>
      </main>

      <Motion />
    </>
  )
}
