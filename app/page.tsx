import Motion from './motion'

const EMAIL = 'vlad.tamas@gmail.com'

function Mark() {
  return (
    <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#f4f5f7" />
      <path d="M8.5 10.5l4.2 11 4.2-11M17.6 10.5h6.4M20.8 10.5v11" fill="none" stroke="#050506" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <>
      <span data-sc-progress aria-hidden="true" />
      <div className="sc-grain" aria-hidden="true" />

      <header className="nav" data-nav>
        <div className="nav__inner">
          <a className="nav__brand" href="#top" aria-label="Vlad Tamas, back to top">
            <Mark />
            <span>Vlad Tamas</span>
          </a>
          <nav className="nav__links" aria-label="Sections">
            <a href="#work" data-nav-link="work">Work</a>
            <a href="#approach" data-nav-link="approach">Approach</a>
            <a href="#contact" data-nav-link="contact">Contact</a>
          </nav>
          <a className="pill pill--ghost" href={`mailto:${EMAIL}`}>Get in touch</a>
        </div>
      </header>

      <main id="top">
        {/* 1 · Hero: dusk gradient, centred claim, the work rising from the horizon. */}
        <section className="hero" data-sc-act="flow">
          <div className="hero__sky" data-sc-parallax="0.8" aria-hidden="true" />
          <div className="hero__glow" data-sc-parallax="-0.4" aria-hidden="true" />
          <div className="hero__copy sc-wrap" data-sc-in data-sc-stagger="70">
            <p className="badge"><i />Web and mobile developer</p>
            <h1 className="hero__h">
              Websites and apps that feel right on every screen.
            </h1>
            <p className="hero__sub">
              I&apos;m Vlad Tamas. I design, build and launch products for the web and for phones.
            </p>
            <p><a className="pill pill--light" href="#work">See the work</a></p>
          </div>
          <div className="hero__frame" data-sc-parallax="-1.6" aria-hidden="true">
            <div className="browser">
              <div className="browser__bar"><i /><i /><i /><span>acrovents.com</span></div>
              <img src="/work/acro-desktop.webp" width={1800} height={1125} alt="" />
            </div>
          </div>
          <div className="hero__fade" aria-hidden="true" />
        </section>

        {/* 2 · The work (peak): desktop folds into a phone under the scroll. */}
        <section id="work" className="case" data-sc-act="pin" data-sc-span="3.2" data-section="work" data-fold-act>
          <div data-sc-stage className="case__stage">
            <div className="case__grid sc-wrap">
              <div className="case__copy">
                <p className="badge"><i />Selected work</p>
                <h2 className="duo">
                  <span>Acro Events.</span>
                  <span className="duo__soft">Built for every screen.</span>
                </h2>
                <p className="case__intro">
                  An events site for an acrobatics community: one strong identity, the next
                  gathering up front, and a direct line for collaborations.
                </p>
                <dl className="facts">
                  <div><dt>Client</dt><dd>Acro Events</dd></div>
                  <div><dt>Year</dt><dd>2025</dd></div>
                  <div><dt>Role</dt><dd>Design and development</dd></div>
                  <div><dt>Built with</dt><dd>Next.js, Vercel</dd></div>
                </dl>
                <div className="case__foot">
                  <p className="readout" aria-hidden="true">
                    <span className="readout__px" data-readout>1440</span>
                    <span className="readout__unit">px wide</span>
                  </p>
                  <a className="case__link" href="https://www.acrovents.com" target="_blank" rel="noopener">
                    Visit acrovents.com
                    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M5 11L11 5M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                </div>
              </div>

              <div className="panel panel--dusk case__panel">
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
                    <button type="button" className="pill pill--light btn--live" data-live-toggle>
                      Try it live
                    </button>
                    <span className="fold__note">Real captures at 1440 and 390 pixels.</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* 3 · Approach: split header, then an asymmetric bento of what I build. */}
        <section id="approach" className="approach" data-sc-act="flow" data-section="approach">
          <div className="sc-wrap">
            <div className="split" data-sc-in data-sc-stagger="60">
              <div>
                <p className="badge"><i />How I work</p>
                <h2 className="duo">
                  <span>One product.</span>
                  <span className="duo__soft">Every screen.</span>
                </h2>
              </div>
              <p className="split__aside">
                Most people meet a product on their phone first and a laptop second. I plan
                for both from the first sketch, so each layout is written for its screen
                rather than squeezed onto it.
              </p>
            </div>

            <div className="bento">
              <article className="card card--wide" data-sc-in>
                <div className="card__text">
                  <p className="card__tag"><i />Websites</p>
                  <h3 className="card__h">Sites and web apps that load fast and stay easy to change.</h3>
                  <p className="card__p">
                    Marketing sites and web apps in React and Next.js, deployed on Vercel.
                  </p>
                </div>
                <div className="card__media panel panel--dusk">
                  <div className="card__shot card__shot--desk" data-sc-parallax="-0.7">
                    <img src="/work/acro-desktop-full.webp" width={1440} height={1412} alt="Full Acro Events desktop page, including the upcoming events list." loading="lazy" />
                  </div>
                </div>
              </article>

              <article className="card card--phone" data-sc-in>
                <div className="card__media card__media--tall panel panel--dusk">
                  <div className="card__shot card__shot--phone" data-sc-parallax="-0.9">
                    <img src="/work/acro-mobile-full.webp" width={600} height={2203} alt="Acro Events on a phone, single-column layout." loading="lazy" />
                  </div>
                </div>
                <div className="card__text">
                  <p className="card__tag"><i />Mobile</p>
                  <h3 className="card__h">At home under a thumb.</h3>
                  <p className="card__p">Apps and mobile-first interfaces with tap targets, type and layout made for a phone.</p>
                </div>
              </article>

              <article className="card card--steps" data-sc-in>
                <div className="card__text">
                  <p className="card__tag"><i />Idea to live</p>
                  <h3 className="card__h">One pair of hands, start to finish.</h3>
                  <p className="card__p">Nothing gets lost between the person who designed it and the person who built it.</p>
                </div>
                <ol className="steps">
                  <li><span className="steps__n">01</span><span><b>Design</b>Layouts for phone and desktop, decided together.</span></li>
                  <li><span className="steps__n">02</span><span><b>Build</b>Clean, fast code you can keep working on.</span></li>
                  <li><span className="steps__n">03</span><span><b>Launch</b>Deployed, on your domain, and handed over.</span></li>
                </ol>
              </article>
            </div>
          </div>
        </section>

        {/* 4 · Contact: the brightest moment on the page, then the footer. */}
        <section id="contact" className="contact" data-sc-act="flow" data-section="contact">
          <div className="sc-wrap">
            <div className="cta panel panel--bright" data-sc-reveal="up" data-sc-reveal-at="0.04 0.34">
              <div className="cta__copy">
                <h2 className="cta__h">Have something in mind?</h2>
                <p className="cta__p">
                  Tell me what you are building. A website, an app, or just an idea you want a
                  second opinion on.
                </p>
                <p className="cta__actions">
                  <a className="pill pill--light" href={`mailto:${EMAIL}`}>Get in touch</a>
                  <a className="cta__mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </p>
              </div>
            </div>

            <footer className="foot">
              <div className="foot__brand">
                <a className="nav__brand" href="#top"><Mark /><span>Vlad Tamas</span></a>
                <p>Web and mobile developer, building for every screen.</p>
              </div>
              <div className="foot__col">
                <p className="foot__h">Work</p>
                <a href="#work">Acro Events</a>
                <a href="https://www.acrovents.com" target="_blank" rel="noopener">acrovents.com</a>
              </div>
              <div className="foot__col">
                <p className="foot__h">Contact</p>
                <a href={`mailto:${EMAIL}`}>Email</a>
              </div>
              <p className="foot__legal">© 2026 Vlad Tamas</p>
            </footer>
          </div>
        </section>
      </main>

      <Motion />
    </>
  )
}
