import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/categories';
import { getExpenses } from '../api/expenses';
import { getShifts, getShiftSummary } from '../api/shifts';
import { TrendChart } from '../components/dashboard/TrendChart';
import { ExpenseModal } from '../components/expenses/ExpenseModal';
import { PageHeader } from '../components/layout/PageHeader';
import { InlineError, LoadingRow } from '../components/ui/Feedback';
import type { Category, Expense, Shift, ShiftSummary } from '../types/models';
import {
  categoryColor,
  computeCategoryBreakdown,
  computeTrend,
  daysElapsed,
  expensesBetween,
  formatCurrency,
  formatRangeLabel,
  formatShortDate,
  getPeriodRange,
  getPreviousRange,
  parseLocalDate,
  shiftsBetween,
  sumAmounts,
  toDateParam,
  trendStart,
  type Period,
} from '../utils/dashboardStats';
import { usePayPeriod } from '../utils/usePayPeriod';

const PERIODS: Period[] = ['week', 'month', 'year'];
const PERIOD_NOUN: Record<Period, string> = { week: 'week', month: 'month', year: 'year' };

interface DashboardData {
  expenses: Expense[];
  shifts: Shift[];
  payExpenses: Expense[];
  paySummary: ShiftSummary;
}

export function DashboardPage() {
  const [period, setPeriod] = useState<Period>('month');
  const [payPeriod] = usePayPeriod();
  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories, () => setError('Could not load categories.'));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const now = new Date();
    const current = getPeriodRange(period, now);
    const previous = getPreviousRange(period, current);
    const from = [trendStart(period, now), previous.start, current.start].reduce((a, b) => (a < b ? a : b));
    const wide = { start_date: toDateParam(from), end_date: toDateParam(now) };
    const pay = { start_date: payPeriod.start, end_date: payPeriod.end };

    // eslint-disable-next-line react-hooks/set-state-in-effect -- show a loading state while refetching after a period change
    setLoading(true);
    setError(null);
    Promise.all([getExpenses(wide), getShifts(wide), getExpenses(pay), getShiftSummary(pay)])
      .then(([expenses, shifts, payExpenses, paySummary]) => {
        if (!cancelled) setData({ expenses, shifts, payExpenses, paySummary });
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your dashboard. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period, payPeriod.start, payPeriod.end, reloadKey]);

  const handleSaved = useCallback(() => {
    setAddOpen(false);
    setReloadKey((k) => k + 1);
  }, []);

  const range = getPeriodRange(period);
  const noun = PERIOD_NOUN[period];

  const actions = (
    <>
      <div className="seg" role="radiogroup" aria-label="Period">
        {PERIODS.map((p) => (
          <label className="seg-opt" key={p}>
            <input type="radio" name="period" checked={period === p} onChange={() => setPeriod(p)} />
            {p[0].toUpperCase() + p.slice(1)}
          </label>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={() => setAddOpen(true)}>
        <Plus size={15} aria-hidden="true" />
        Add expense
      </button>
    </>
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`${formatRangeLabel(range.start, range.end)} · ${noun} to date`}
        actions={actions}
      />
      <div className="page-body">
        {error && <InlineError message={error} />}
        {loading && !data ? (
          <div className="panel"><LoadingRow /></div>
        ) : data ? (
          <DashboardBody
            period={period}
            data={data}
            categories={categories}
            payStart={payPeriod.start}
            payEnd={payPeriod.end}
            dimmed={loading}
          />
        ) : null}
      </div>
      {addOpen && (
        <ExpenseModal initialExpense={null} categories={categories} onClose={() => setAddOpen(false)} onSaved={handleSaved} />
      )}
    </>
  );
}

interface BodyProps {
  period: Period;
  data: DashboardData;
  categories: Category[];
  payStart: string;
  payEnd: string;
  dimmed: boolean;
}

function DashboardBody({ period, data, categories, payStart, payEnd, dimmed }: BodyProps) {
  const now = new Date();
  const current = getPeriodRange(period, now);
  const previous = getPreviousRange(period, current);
  const noun = PERIOD_NOUN[period];

  const periodExpenses = expensesBetween(data.expenses, current);
  const previousExpenses = expensesBetween(data.expenses, previous);
  const periodShifts = shiftsBetween(data.shifts, current);

  const spent = sumAmounts(periodExpenses);
  const prevSpent = sumAmounts(previousExpenses);
  const delta = spent - prevSpent;
  const elapsed = daysElapsed(current.start, current.end);

  const income = periodShifts.reduce((sum, s) => sum + parseFloat(s.estimated_pay), 0);
  const hours = periodShifts.reduce((sum, s) => sum + parseFloat(s.paid_hours), 0);

  const breakdown = computeCategoryBreakdown(periodExpenses, categories);
  const trend = computeTrend(period, data.expenses, data.shifts, now);
  const recent = [...data.expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const payGross = parseFloat(data.paySummary.estimated_gross_pay);
  const paySpent = sumAmounts(data.payExpenses);
  const payLabel = `${formatRangeLabel(parseLocalDate(payStart), parseLocalDate(payEnd))}`;

  return (
    <div style={{ display: 'contents', opacity: dimmed ? 0.6 : 1 }}>
      <div className="figure-grid">
        <div className="panel figure">
          <div className="figure-label">Spent this {noun}</div>
          <div className="figure-value">{formatCurrency(spent)}</div>
          <div className="figure-meta">
            {delta >= 0 ? '+' : '−'}{formatCurrency(Math.abs(delta))} vs last {noun}
          </div>
        </div>
        <div className="panel figure">
          <div className="figure-label">Daily average</div>
          <div className="figure-value">{formatCurrency(spent / elapsed)}</div>
          <div className="figure-meta">over {elapsed} {elapsed === 1 ? 'day' : 'days'} this {noun}</div>
        </div>
        <div className="panel figure">
          <div className="figure-label">Estimated shift income</div>
          <div className="figure-value">{formatCurrency(income)}</div>
          <div className="figure-meta">
            {periodShifts.length} {periodShifts.length === 1 ? 'shift' : 'shifts'} · {hours.toFixed(2)} paid hours
          </div>
        </div>
      </div>

      <div className="split">
        <div className="panel">
          <div className="panel-head">
            <div>
              <div className="panel-title">Spending trend</div>
              <div className="panel-sub">{trend.caption}</div>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="legend-line" /> Spending</span>
              <span className="legend-item"><span className="legend-line legend-line-dashed" /> Shift income</span>
            </div>
          </div>
          <TrendChart trend={trend} />
        </div>

        <div className="panel panel-pad">
          <div className="panel-title" style={{ marginBottom: 'var(--space-4)' }}>Spending by category</div>
          {breakdown.length === 0 ? (
            <p className="empty-body">No expenses this {noun}.</p>
          ) : (
            <div className="cat-list">
              {breakdown.map((cat) => (
                <div key={cat.id}>
                  <div className="cat-line">
                    <span>{cat.name}</span>
                    <span>{cat.amountFormatted}</span>
                  </div>
                  <div className="cat-track">
                    <div className="cat-fill" style={{ width: cat.pct, background: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="panel-foot">
            <span>{breakdown.length} {breakdown.length === 1 ? 'category' : 'categories'}</span>
            <span className="num">{formatCurrency(spent)} total</span>
          </div>
        </div>
      </div>

      <div className="split">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Recent expenses</div>
            <Link className="panel-link" to="/expenses">View all</Link>
          </div>
          {recent.length === 0 ? (
            <div className="recent-row"><span className="empty-body">No expenses yet.</span></div>
          ) : (
            recent.map((e) => {
              const cat = categories.find((c) => c.id === e.category);
              return (
                <div className="recent-row row-hover" key={e.id}>
                  <div className="recent-stripe" style={{ background: categoryColor(categories, e.category) }} />
                  <div className="recent-main">
                    <div className="recent-desc">{e.description || cat?.name || 'Expense'}</div>
                    <div className="recent-meta">{cat?.name ?? 'Uncategorised'} · {formatShortDate(new Date(e.date))}</div>
                  </div>
                  <div className="recent-amount">{formatCurrency(parseFloat(e.amount))}</div>
                </div>
              );
            })
          )}
        </div>

        <div className="panel panel-pad">
          <div className="panel-head" style={{ padding: 0, marginBottom: 'var(--space-4)' }}>
            <div className="panel-title">Pay period</div>
            <Link className="panel-link" to="/shifts">Change</Link>
          </div>
          <div className="panel-sub">Current period</div>
          <div style={{ fontSize: 14, margin: '4px 0 var(--space-4)' }}>{payLabel}</div>
          <div className="kv-list">
            <div className="kv"><span>Shifts logged</span><span>{data.paySummary.total_shifts}</span></div>
            <div className="kv"><span>Paid hours</span><span>{parseFloat(data.paySummary.total_hours).toFixed(2)}</span></div>
            <div className="kv kv-strong"><span>Estimated gross</span><span>{formatCurrency(payGross)}</span></div>
          </div>
          <div className="panel-foot" style={{ display: 'block' }}>
            {payGross > 0
              ? `Spending is ${Math.round((paySpent / payGross) * 100)}% of estimated income this period.`
              : 'Log shifts in this pay period to compare spending with income.'}
          </div>
        </div>
      </div>
    </div>
  );
}
