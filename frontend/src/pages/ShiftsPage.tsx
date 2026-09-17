import { useEffect, useState } from 'react';
import { Nav } from '../components/layout/Nav';
import { PageBackground } from '../components/layout/PageBackground';
import { ShiftModal } from '../components/shifts/ShiftModal';
import { deleteShift, getShiftDefaults, getShifts, getShiftSummary } from '../api/shifts';
import type { Shift, ShiftSummary } from '../types/models';
import { formatCurrency } from '../utils/dashboardStats';
import { formatBreakLabel, formatDateLabel } from '../utils/shifts';

const EMPTY_SUMMARY: ShiftSummary = { total_shifts: 0, total_hours: '0.00', estimated_gross_pay: '0.00' };

function defaultRangeStart(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function defaultRangeEnd(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

async function loadShiftsAndSummary(start: string, end: string) {
  const params = {
    ...(start ? { start_date: start } : {}),
    ...(end ? { end_date: end } : {}),
  };
  return Promise.all([getShifts(params), getShiftSummary(params)]);
}

export function ShiftsPage() {
  const [rangeStart, setRangeStart] = useState(defaultRangeStart());
  const [rangeEnd, setRangeEnd] = useState(defaultRangeEnd());
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [summary, setSummary] = useState<ShiftSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultRate, setDefaultRate] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalShift, setModalShift] = useState<Shift | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const [shiftsData, summaryData] = await loadShiftsAndSummary(rangeStart, rangeEnd);
        if (cancelled) return;
        setShifts(shiftsData);
        setSummary(summaryData);
      } catch {
        if (!cancelled) setError('Could not load shifts. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [rangeStart, rangeEnd]);

  useEffect(() => {
    getShiftDefaults()
      .then((data) => setDefaultRate(data.hourly_rate ?? ''))
      .catch(() => {});
  }, []);

  async function refetch() {
    setLoading(true);
    setError(null);
    try {
      const [shiftsData, summaryData] = await loadShiftsAndSummary(rangeStart, rangeEnd);
      setShifts(shiftsData);
      setSummary(summaryData);
    } catch {
      setError('Could not load shifts. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setModalShift(null);
    setModalOpen(true);
  }

  function openEditModal(shift: Shift) {
    setModalShift(shift);
    setModalOpen(true);
  }

  function handleShiftSaved(saved: Shift, keepOpen: boolean) {
    setDefaultRate(saved.hourly_rate);
    refetch();
    if (!keepOpen) {
      setModalOpen(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this shift?')) return;

    try {
      await deleteShift(id);
      refetch();
    } catch {
      setError('Could not delete shift. Please try again.');
    }
  }

  const hasShifts = shifts.length > 0;
  const rangeLabel =
    rangeStart && rangeEnd
      ? `${formatDateLabel(rangeStart)} – ${formatDateLabel(rangeEnd)}`
      : 'Select a pay period';

  return (
    <PageBackground>
      <Nav />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ marginBottom: 2 }}>Shifts</h1>
            <div className="text-muted">Log your shifts and estimate gross pay for any pay period.</div>
          </div>
          <button type="button" className="btn btn-primary" onClick={openAddModal}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Add shift
          </button>
        </div>

        <hr className="hr" />

        <div className="card elev-sm">
          <div className="card-kicker">Pay period</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
            <div className="field pay-period-field" style={{ margin: 0 }}>
              <label htmlFor="range-start">Start date</label>
              <input
                className="input"
                id="range-start"
                type="date"
                value={rangeStart}
                onChange={(event) => setRangeStart(event.target.value)}
              />
            </div>
            <div className="field pay-period-field" style={{ margin: 0 }}>
              <label htmlFor="range-end">End date</label>
              <input
                className="input"
                id="range-end"
                type="date"
                value={rangeEnd}
                onChange={(event) => setRangeEnd(event.target.value)}
              />
            </div>
            <div className="pay-period-range">
              <div className="text-muted" style={{ fontSize: 13 }}>{rangeLabel}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          <div className="card elev-sm">
            <div className="card-kicker">Estimated gross pay</div>
            <div className="summary-value">{formatCurrency(parseFloat(summary.estimated_gross_pay))}</div>
            <div className="card-meta">before tax and deductions</div>
          </div>
          <div className="card elev-sm">
            <div className="card-kicker">Total paid hours</div>
            <div className="summary-value">{parseFloat(summary.total_hours).toFixed(2)}</div>
            <div className="card-meta">breaks excluded</div>
          </div>
          <div className="card elev-sm">
            <div className="card-kicker">Shifts</div>
            <div className="summary-value">{summary.total_shifts}</div>
            <div className="card-meta">in selected period</div>
          </div>
        </div>

        <hr className="hr" />

        {error && (
          <div style={{ color: 'var(--color-accent)', fontSize: 13, marginBottom: 'var(--space-3)' }}>{error}</div>
        )}

        {loading ? (
          <div className="text-muted" style={{ padding: 'var(--space-4) 0' }}>Loading…</div>
        ) : hasShifts ? (
          <>
            <div className="shift-table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
                    <th style={{ textAlign: 'right' }}>Break</th>
                    <th style={{ textAlign: 'right' }}>Paid hours</th>
                    <th style={{ textAlign: 'right' }}>Rate</th>
                    <th style={{ textAlign: 'right' }}>Est. pay</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift) => (
                    <tr key={shift.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDateLabel(shift.date)}</td>
                      <td>{shift.start_time.slice(0, 5)}</td>
                      <td>{shift.end_time.slice(0, 5)}</td>
                      <td className="num">{formatBreakLabel(shift.break_minutes)}</td>
                      <td className="num">{parseFloat(shift.paid_hours).toFixed(2)}</td>
                      <td className="num">{formatCurrency(parseFloat(shift.hourly_rate))}</td>
                      <td className="num" style={{ fontWeight: 700 }}>{formatCurrency(parseFloat(shift.estimated_pay))}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                          <button type="button" className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => openEditModal(shift)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            style={{ padding: '4px 8px', color: 'var(--color-accent-700)' }}
                            onClick={() => handleDelete(shift.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="shift-cards">
              {shifts.map((shift) => (
                <div key={shift.id} className="shift-card">
                  <div className="shift-card-header">{formatDateLabel(shift.date)}</div>
                  <div className="shift-card-meta">
                    {shift.start_time.slice(0, 5)} – {shift.end_time.slice(0, 5)} · {formatBreakLabel(shift.break_minutes)} break
                  </div>
                  <div className="shift-card-values">
                    <div>
                      <div className="shift-card-value-label">Paid hours</div>
                      <div className="shift-card-value">{parseFloat(shift.paid_hours).toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="shift-card-value-label">Rate</div>
                      <div className="shift-card-value">{formatCurrency(parseFloat(shift.hourly_rate))}</div>
                    </div>
                    <div>
                      <div className="shift-card-value-label">Est. pay</div>
                      <div className="shift-card-value">{formatCurrency(parseFloat(shift.estimated_pay))}</div>
                    </div>
                  </div>
                  <div className="shift-card-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => openEditModal(shift)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ color: 'var(--color-accent-700)' }}
                      onClick={() => handleDelete(shift.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="card elev-sm" style={{ padding: 'var(--space-8) var(--space-6)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 'var(--space-3)' }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <h4 style={{ marginBottom: 'var(--space-1)' }}>No shifts in this period</h4>
            <p className="text-muted" style={{ margin: 0, maxWidth: '46ch' }}>
              Add a shift, or widen the pay period above to see shifts you have already logged.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ShiftModal
          key={modalShift ? modalShift.id : 'new'}
          initialShift={modalShift}
          defaultHourlyRate={defaultRate}
          onClose={() => setModalOpen(false)}
          onSaved={handleShiftSaved}
        />
      )}
    </PageBackground>
  );
}
