import {
  MOCK_BARS,
  MOCK_HOUR_BARS,
  MOCK_NAV,
  MOCK_PHONE_TILES,
  MOCK_RECENT,
  MOCK_SHIFT_ROWS,
  MOCK_SHIFT_TOTALS,
  MOCK_TILES,
} from './landingData';

function MockSidebar({ active }: { active: string }) {
  return (
    <div className="mock-nav">
      <div className="mock-brand">Finance Tracker</div>
      {MOCK_NAV.map((label) => (
        <div key={label} className={`mock-nav-item${label === active ? ' active' : ''}`}>{label}</div>
      ))}
    </div>
  );
}

function MockTiles({ tiles }: { tiles: { label: string; value: string; meta: string }[] }) {
  return (
    <div className="mock-tiles">
      {tiles.map((t) => (
        <div className="mock-tile" key={t.label}>
          <div className="mock-tile-label">{t.label}</div>
          <div className="mock-tile-value">{t.value}</div>
          <div className="mock-tile-meta">{t.meta}</div>
        </div>
      ))}
    </div>
  );
}

function MockBars() {
  return (
    <div className="mock-bars">
      {MOCK_BARS.map((bar) => (
        <div key={bar.name}>
          <div className="mock-bar-line"><span>{bar.name}</span><span>{bar.amount}</span></div>
          <div className="cat-track"><div className="cat-fill" style={{ width: bar.pct, background: bar.color }} /></div>
        </div>
      ))}
    </div>
  );
}

export function MiniChart({ viewBox = '0 0 360 110' }: { viewBox?: string }) {
  return (
    <svg className="chart-svg" viewBox={viewBox} aria-hidden="true">
      <line className="chart-grid" x1="0" y1="25" x2="360" y2="25" />
      <line className="chart-grid" x1="0" y1="65" x2="360" y2="65" />
      <line className="chart-grid" x1="0" y1="104" x2="360" y2="104" />
      <polyline className="chart-income" points="0,52 72,62 144,40 216,74 288,32 360,44" />
      <polygon className="chart-area" points="0,104 0,80 72,68 144,86 216,48 288,60 360,24 360,104" />
      <polyline className="chart-line" points="0,80 72,68 144,86 216,48 288,60 360,24" />
      <circle className="chart-dot" cx="360" cy="24" r="4" />
    </svg>
  );
}

export function DashboardMock() {
  return (
    <div className="mock">
      <MockSidebar active="Dashboard" />
      <div className="mock-main">
        <div className="mock-head">
          <div>
            <div className="mock-title">Dashboard</div>
            <div className="mock-sub">1 – 18 September 2026</div>
          </div>
          <span className="mock-pill">Add expense</span>
        </div>
        <MockTiles tiles={MOCK_TILES} />
        <div className="mock-split">
          <div className="mock-box">
            <div className="mock-box-title">Spending trend · 6 months</div>
            <MiniChart />
          </div>
          <div className="mock-box">
            <div className="mock-box-title">By category</div>
            <MockBars />
          </div>
        </div>
        <div className="mock-box">
          <div className="mock-box-title">Recent expenses</div>
          {MOCK_RECENT.map((row) => (
            <div className="mock-recent" key={row.description}>
              <span className="recent-stripe" style={{ background: row.color, height: 20 }} />
              <span className="mock-recent-desc">{row.description}</span>
              <span className="mock-recent-meta">{row.meta}</span>
              <span className="mock-recent-amount">{row.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShiftsMock() {
  return (
    <div className="mock">
      <MockSidebar active="Shifts" />
      <div className="mock-main">
        <div className="mock-head">
          <div>
            <div className="mock-title">Shifts</div>
            <div className="mock-sub">Pay period 17 Aug – 20 Sep 2026</div>
          </div>
          <span className="mock-pill">Add shift</span>
        </div>
        <MockTiles tiles={MOCK_SHIFT_TOTALS} />
        <div className="mock-box mock-table">
          <div className="mock-shift-row mock-shift-head">
            <span>Date</span><span>Hours worked</span><span>Paid hours</span><span>Est. pay</span>
          </div>
          {MOCK_SHIFT_ROWS.map((row) => (
            <div className="mock-shift-row" key={row.date}>
              <span>{row.date}</span><span>{row.time}</span><span>{row.hours}</span><span>{row.pay}</span>
            </div>
          ))}
        </div>
        <div className="mock-box">
          <div className="mock-box-title">Paid hours per week</div>
          <div className="mock-hours">
            {MOCK_HOUR_BARS.map((h, i) => (
              <div className="mock-hour" key={h.week}>
                <span>{h.value}</span>
                <span
                  className="mock-hour-bar"
                  style={{ height: h.pct, background: i === MOCK_HOUR_BARS.length - 1 ? 'var(--color-accent)' : 'var(--color-chart-grey)' }}
                />
                <span>{h.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Phone({ dark, label }: { dark?: boolean; label: string }) {
  return (
    <div className={`phone ${dark ? 'phone-dark' : 'phone-light'}`} aria-hidden="true">
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="phone-content">
          <div className="phone-top"><span>Finance Tracker</span><span className="phone-avatar">SA</span></div>
          <div className="phone-title">Dashboard</div>
          <div className="phone-tiles">
            {MOCK_PHONE_TILES.map((t) => (
              <div className="phone-tile" key={t.label}>
                <div className="phone-tile-value">{t.value}</div>
                <div className="phone-tile-label">{t.label}</div>
              </div>
            ))}
          </div>
          <div className="phone-section">By category</div>
          <MockBars />
        </div>
        <div className="phone-tabbar">
          <span className="active">Dashboard</span><span>Expenses</span><span>Shifts</span>
        </div>
      </div>
      <div className="phone-pill">{label}</div>
    </div>
  );
}
