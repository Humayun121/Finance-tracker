import { Check, Plus, Smartphone } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  AUDIENCES,
  FAQS,
  INSTALL_STEPS,
  MOCK_BARS,
  MOCK_TILES,
  PROOF,
  STEPS,
  WHAT_IT_DOES,
} from '../components/landing/landingData';
import { DashboardMock, MiniChart, Phone, ShiftsMock } from '../components/landing/Mocks';

type MockScreen = 'dashboard' | 'shifts';

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="lp-eyebrow">
      <span className="lp-eyebrow-rule" />
      <span>{children}</span>
    </div>
  );
}

export function LandingPage() {
  const [screen, setScreen] = useState<MockScreen>('dashboard');

  return (
    <div className="lp">
      <header className="lp-header">
        <div className="lp-header-inner">
          <div className="lp-brand">Finance Tracker</div>
          <nav className="lp-nav" aria-label="Sections">
            <a href="#what">What it is</a>
            <a href="#features">Features</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#mobile">Mobile</a>
            <a href="#faq">FAQ</a>
            <Link to="/login">Log in</Link>
          </nav>
          <Link to="/signup" className="btn btn-primary lp-signup">Sign up</Link>
        </div>
      </header>

      <section className="lp-hero">
        <div className="lp-grid lp-hero-grid">
          <div>
            <div className="lp-kicker">Expenses · Categories · Shifts</div>
            <h1 className="lp-h1">Know where your money goes.</h1>
            <p className="lp-lead">
              Finance Tracker records every expense, groups it by category, and estimates what your shifts pay, so a month
              adds up in one place instead of three.
            </p>
            <div className="lp-actions">
              <Link to="/signup" className="btn btn-primary lp-btn-lg">Get started</Link>
              <Link to="/login" className="btn btn-secondary lp-btn-lg">Log in</Link>
            </div>
          </div>

          <div className="lp-window" aria-hidden="true">
            <div className="lp-window-bar">
              <span className="lp-window-dot" />
              <span className="lp-window-dot" />
              <span className="lp-window-title">Dashboard · September 2026</span>
            </div>
            <div className="lp-window-body">
              <div className="lp-window-side">
                <span className="lp-window-mark lp-window-mark-active" />
                <span className="lp-window-mark" />
                <span className="lp-window-mark" />
                <span className="lp-window-mark" />
              </div>
              <div className="lp-window-main">
                <div className="mock-tiles">
                  {MOCK_TILES.map((t) => (
                    <div className="mock-tile" key={t.label}>
                      <div className="mock-tile-label">{t.label}</div>
                      <div className="mock-tile-value">{t.value}</div>
                    </div>
                  ))}
                </div>
                <MiniChart viewBox="0 0 360 110" />
                <div className="mock-bars">
                  {MOCK_BARS.map((bar) => (
                    <div className="lp-window-bar-row" key={bar.name}>
                      <span className="lp-window-bar-name">{bar.name}</span>
                      <span className="cat-track lp-window-bar-track">
                        <span className="cat-fill" style={{ display: 'block', width: bar.pct, background: bar.color }} />
                      </span>
                      <span className="mock-recent-meta">{bar.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-container lp-proof-wrap">
          <div className="lp-proof">
            {PROOF.map((p) => (
              <div className="lp-proof-cell" key={p.value}>
                <div className="lp-proof-value">{p.value}</div>
                <div className="lp-proof-label">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="what" className="lp-section">
        <div className="lp-grid lp-grid-what">
          <div>
            <Eyebrow>What it is</Eyebrow>
            <h2 className="lp-h2">A spending and shift log you actually keep up with.</h2>
            <p className="lp-body">
              Finance Tracker is a personal finance tool for money that moves week to week. Log an expense in a few
              seconds, put it in a category you named, and see the month build up as you go.
            </p>
            <p className="lp-body">
              If you’re paid hourly, add your shifts too. Start time, end time, break and rate are all it needs to work
              out paid hours and estimated gross pay for whatever period your employer runs.
            </p>
          </div>
          <div className="lp-capabilities">
            {WHAT_IT_DOES.map((label) => (
              <div className="lp-capability" key={label}>
                <span className="auth-tick"><Check size={12} strokeWidth={3} aria-hidden="true" /></span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="lp-section">
        <div className="lp-container">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="lp-h2">Three things to keep on top of, one place to do it.</h2>
          <p className="lp-body lp-body-wide">
            No receipts to photograph and no bank connection to set up. You log what you spend and what you work, and the
            totals follow.
          </p>
          <div className="lp-cards">
            {STEPS.map((step) => (
              <div className="panel lp-step" key={step.number}>
                <div className="lp-step-number">{step.number}</div>
                <h3 className="lp-card-title">{step.title}</h3>
                <p className="lp-card-body">{step.body}</p>
                <div className="lp-step-foot">
                  <div className="cat-track"><div className="cat-fill" style={{ width: step.pct, background: 'var(--color-accent)' }} /></div>
                  <div className="lp-step-metric"><span>{step.metric}</span><span>{step.value}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="lp-section">
        <div className="lp-container">
          <Eyebrow>The dashboard</Eyebrow>
          <h2 className="lp-h2">The whole month on one screen.</h2>
          <p className="lp-body lp-body-wide">
            Spending this month and this week, estimated shift income, a six-month trend and your category breakdown,
            without clicking into anything. Switch over to Shifts for paid hours and estimated gross pay across your pay
            period.
          </p>

          <div className="lp-tablet-wrap">
            <div className="lp-tabs" role="tablist" aria-label="Product screens">
              {(['dashboard', 'shifts'] as MockScreen[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  id={`tab-${s}`}
                  aria-selected={screen === s}
                  aria-controls="tablet-screen"
                  className={`lp-tab${screen === s ? ' active' : ''}`}
                  onClick={() => setScreen(s)}
                >
                  {s === 'dashboard' ? 'Dashboard' : 'Shifts'}
                </button>
              ))}
            </div>
            <div className="bezel-tablet">
              <div className="bezel-tablet-screen" role="tabpanel" id="tablet-screen" aria-labelledby={`tab-${screen}`}>
                {screen === 'dashboard' ? <DashboardMock /> : <ShiftsMock />}
              </div>
            </div>
            <p className="lp-caption">Illustrative sample data.</p>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-container">
          <Eyebrow>Who it’s for</Eyebrow>
          <h2 className="lp-h2">Built for income that isn’t the same every month.</h2>
          <div className="lp-cards">
            {AUDIENCES.map((aud) => (
              <div className="panel lp-audience" key={aud.title}>
                <span className="lp-chip">{aud.initial}</span>
                <div>
                  <h3 className="lp-card-title">{aud.title}</h3>
                  <p className="lp-card-body">{aud.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mobile" className="lp-section">
        <div className="lp-grid lp-grid-mobile">
          <div>
            <Eyebrow>On your phone</Eyebrow>
            <h2 className="lp-h2">Use it like a real app.</h2>
            <p className="lp-body">
              No download and no app store. Save Finance Tracker to your home screen and it opens full screen, which is
              handy when you are logging a shift on the way out of work.
            </p>
            <ol className="lp-install">
              {INSTALL_STEPS.map((label, i) => (
                <li key={label}>
                  <span className="lp-install-n">{i + 1}</span>
                  <span>{label}</span>
                </li>
              ))}
            </ol>
            <div className="lp-platforms">
              <Smartphone size={14} aria-hidden="true" />
              Works on iOS and Android
            </div>
          </div>

          <div className="lp-phones">
            <div className="lp-phone-slot lp-phone-slot-dark"><Phone dark label="DARK" /></div>
            <div className="lp-phone-slot lp-phone-slot-light"><Phone label="LIGHT" /></div>
          </div>
        </div>
      </section>

      <section id="faq" className="lp-section">
        <div className="lp-container lp-faq-wrap">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="lp-h2">Frequently asked questions.</h2>
          <div className="lp-faq">
            {FAQS.map((faq) => (
              <details key={faq.q}>
                <summary>
                  {faq.q}
                  <span className="lp-faq-plus"><Plus size={14} aria-hidden="true" /></span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-poster">
        <div className="lp-container lp-poster-inner">
          <div className="lp-poster-text">Two minutes to set up. One place for the whole month.</div>
          <Link to="/signup" className="btn lp-poster-btn">Get started</Link>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-grid-footer">
            <div>
              <div className="lp-brand">Finance Tracker</div>
              <p className="lp-footer-blurb">
                Track expenses, group them your way, and estimate what your shifts pay, for any period.
              </p>
            </div>
            <div>
              <div className="lp-footer-title">Product</div>
              <div className="lp-footer-links">
                <a href="#what">What it is</a>
                <a href="#features">How it works</a>
                <a href="#dashboard">Dashboard</a>
              </div>
            </div>
            <div>
              <div className="lp-footer-title">Account</div>
              <div className="lp-footer-links">
                <Link to="/login">Log in</Link>
                <Link to="/signup">Sign up</Link>
              </div>
            </div>
            <div>
              <div className="lp-footer-title">More</div>
              <div className="lp-footer-links">
                <a href="#mobile">On your phone</a>
                <a href="#faq">FAQ</a>
              </div>
            </div>
          </div>
          <div className="lp-footer-base">
            <span>© 2026 Finance Tracker</span>
            <span>A personal finance project</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
