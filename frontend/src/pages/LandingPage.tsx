import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse 900px 500px at 20% 0%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%), var(--color-bg)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -160,
          bottom: -160,
          width: 340,
          height: 340,
          borderRadius: '50%',
          border: '1px solid color-mix(in srgb, var(--color-accent) 45%, transparent)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -90,
          bottom: -90,
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '1px solid var(--color-divider)',
          pointerEvents: 'none',
        }}
      />

      <div className="nav" style={{ position: 'relative' }}>
        <div className="nav-brand">Finance Tracker</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginLeft: 'auto' }}>
          <Link to="/login" style={{ fontSize: 14 }}>
            Log in
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Sign up
          </Link>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ padding: 'var(--space-8) 0' }}>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--color-accent)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Personal expense tracking
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 7vw, 64px)', lineHeight: 1.02, maxWidth: '20ch', marginBottom: 'var(--space-4)' }}>
            Know where your money goes.
          </h1>
          <p
            style={{
              fontSize: 18,
              maxWidth: '56ch',
              marginBottom: 'var(--space-6)',
              color: 'color-mix(in srgb, var(--color-text) 78%, transparent)',
            }}
          >
            Finance Tracker records every expense, groups it by category, and shows you what you actually spend by
            week, month and year.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: 15, padding: '14px 20px' }}>
              Get started
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ fontSize: 15, padding: '14px 20px' }}>
              Log in
            </Link>
          </div>
        </div>

        <hr className="hr" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-4)',
            padding: 'var(--space-6) 0',
          }}
        >
          <div className="card elev-sm">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: 'var(--space-3)' }}
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
            <div className="card-title">Expense tracking</div>
            <p className="card-body">
              Log what you spend with an amount, date, category and a short description. Everything stays in one list
              you can filter by date.
            </p>
          </div>
          <div className="card elev-sm">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: 'var(--space-3)' }}
            >
              <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42Z" />
              <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
            </svg>
            <div className="card-title">Spending categories</div>
            <p className="card-body">
              Create your own categories and assign expenses to them, so your spending is grouped the way you think
              about it.
            </p>
          </div>
          <div className="card elev-sm">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: 'var(--space-3)' }}
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            <div className="card-title">Spending insights</div>
            <p className="card-body">
              A dashboard with your total spend, daily average, top category and a spending trend across weeks,
              months and years.
            </p>
          </div>
        </div>

        <hr className="hr" />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 'var(--space-4) 0 var(--space-6)',
            fontSize: 12,
            color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
          }}
        >
          <span>Finance Tracker</span>
          <span>A personal finance project</span>
        </div>
      </div>
    </div>
  );
}
