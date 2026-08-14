import { useEffect, useState } from 'react';
import { getCategories } from '../api/categories';
import { getExpenses } from '../api/expenses';
import { Nav } from '../components/layout/Nav';
import type { Category, Expense } from '../types/models';
import {
  computeCategoryBreakdown,
  computeTrend,
  daysElapsed,
  formatCurrency,
  getPeriodRange,
  toDateParam,
  type Period,
} from '../utils/dashboardStats';

const PERIOD_LABELS: Record<Period, string> = {
  week: 'week to date',
  month: 'month to date',
  year: 'year to date',
};

export function DashboardPage() {
  const [period, setPeriod] = useState<Period>('month');
  const [categories, setCategories] = useState<Category[]>([]);
  const [periodExpenses, setPeriodExpenses] = useState<Expense[]>([]);
  const [trendExpenses, setTrendExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories().then(setCategories, () => setError('Failed to load categories'));
  }, []);

  useEffect(() => {
    const now = new Date();
    const trendStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    getExpenses({ start_date: toDateParam(trendStart), end_date: toDateParam(now) }).then(
      setTrendExpenses,
      () => setError('Failed to load spending trend'),
    );
  }, []);

  useEffect(() => {
    const { start, end } = getPeriodRange(period);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show a loading state while refetching after a period change
    setLoading(true);
    getExpenses({ start_date: toDateParam(start), end_date: toDateParam(end) })
      .then(setPeriodExpenses, () => setError('Failed to load expenses'))
      .finally(() => setLoading(false));
  }, [period]);

  const { start, end } = getPeriodRange(period);
  const totalSpent = periodExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const elapsed = daysElapsed(start, end);
  const dailyAvg = totalSpent / elapsed;
  const breakdown = computeCategoryBreakdown(periodExpenses, categories);
  const topCategory = breakdown[0];
  const trend = computeTrend(trendExpenses);

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse 900px 500px at 20% 0%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%), var(--color-bg)',
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

      <Nav />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ marginBottom: 2 }}>Dashboard</h1>
            <div className="text-muted">{PERIOD_LABELS[period]}</div>
          </div>
          <div className="seg">
            {(['week', 'month', 'year'] as Period[]).map((p) => (
              <label className="seg-opt" key={p}>
                <input type="radio" name="period" checked={period === p} onChange={() => setPeriod(p)} />
                {p[0].toUpperCase() + p.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <hr className="hr" />

        {error && <p style={{ color: 'var(--color-accent)' }}>{error}</p>}

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
              <div className="card elev-sm">
                <div className="card-kicker">Total spent</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 36 }}>
                  {formatCurrency(totalSpent)}
                </div>
                <div className="card-meta">{elapsed} days elapsed</div>
              </div>
              <div className="card elev-sm">
                <div className="card-kicker">Daily average</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 36 }}>
                  {formatCurrency(dailyAvg)}
                </div>
                <div className="card-meta">across all categories</div>
              </div>
              <div className="card elev-sm">
                <div className="card-kicker">Top category</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 36 }}>
                  {topCategory ? topCategory.name : '—'}
                </div>
                <div className="card-meta">
                  {topCategory ? `${topCategory.amountFormatted} this ${period}` : 'No expenses yet'}
                </div>
              </div>
            </div>

            <hr className="hr" />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
              <div className="card elev-sm" style={{ flex: '2 1 480px', minWidth: 0 }}>
                <h4 style={{ marginBottom: 'var(--space-4)' }}>Spending trend</h4>
                <svg viewBox="0 0 560 200" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  <line x1="0" y1="160" x2="560" y2="160" stroke="var(--color-divider)" strokeWidth={1} />
                  <polygon points={trend.areaPoints} fill="var(--color-accent-100)" />
                  <polyline points={trend.linePoints} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} />
                  {trend.points.map((pt, i) => (
                    <circle key={i} cx={pt.x} cy={pt.y} r={3.5} fill="var(--color-accent)" />
                  ))}
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'color-mix(in srgb, var(--color-text) 55%, transparent)', marginTop: 'var(--space-1)' }}>
                  {trend.months.map((m, i) => (
                    <span key={i}>{m.label}</span>
                  ))}
                </div>
              </div>

              <div className="card elev-sm" style={{ flex: '1 1 280px', minWidth: 0 }}>
                <h4 style={{ marginBottom: 'var(--space-4)' }}>By category</h4>
                {breakdown.length === 0 ? (
                  <p className="text-muted">No expenses in this period.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {breakdown.map((cat) => (
                      <div key={cat.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                          <span>{cat.name}</span>
                          <span className="text-muted">{cat.amountFormatted}</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--color-neutral-200)' }}>
                          <div style={{ height: '100%', background: 'var(--color-accent)', width: cat.pctStyle }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
