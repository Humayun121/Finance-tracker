import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { deleteShift, getShiftDefaults, getShifts, getShiftSummary } from '../api/shifts';
import { PageHeader } from '../components/layout/PageHeader';
import { ShiftModal } from '../components/shifts/ShiftModal';
import { InlineError, LoadingRow } from '../components/ui/Feedback';
import type { Shift, ShiftSummary } from '../types/models';
import { formatCurrency } from '../utils/dashboardStats';
import { formatBreakLabel, formatDateLabel, toTimeInputValue } from '../utils/shifts';
import { usePayPeriod } from '../utils/usePayPeriod';

const EMPTY_SUMMARY: ShiftSummary = { total_shifts: 0, total_hours: '0.00', estimated_gross_pay: '0.00' };

export function ShiftsPage() {
  const [payPeriod, setPayPeriod] = usePayPeriod();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [summary, setSummary] = useState<ShiftSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [defaultRate, setDefaultRate] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalShift, setModalShift] = useState<Shift | null>(null);

  const { start: rangeStart, end: rangeEnd } = payPeriod;

  useEffect(() => {
    let cancelled = false;
    const params = {
      ...(rangeStart ? { start_date: rangeStart } : {}),
      ...(rangeEnd ? { end_date: rangeEnd } : {}),
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect -- show a loading state while refetching after a pay period change
    setLoading(true);
    setError(null);
    Promise.all([getShifts(params), getShiftSummary(params)])
      .then(([shiftsData, summaryData]) => {
        if (cancelled) return;
        setShifts(shiftsData);
        setSummary(summaryData);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load shifts. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [rangeStart, rangeEnd, reloadKey]);

  useEffect(() => {
    getShiftDefaults()
      .then((data) => setDefaultRate(data.hourly_rate ?? ''))
      .catch(() => {});
  }, []);

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
    setReloadKey((k) => k + 1);
    if (!keepOpen) setModalOpen(false);
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this shift?')) return;

    try {
      await deleteShift(id);
      setReloadKey((k) => k + 1);
    } catch {
      setError('Could not delete shift. Please try again.');
    }
  }

  const rangeLabel =
    rangeStart && rangeEnd ? `${formatDateLabel(rangeStart)} – ${formatDateLabel(rangeEnd)}` : 'Select a pay period';

  return (
    <>
      <PageHeader
        title="Shifts"
        subtitle="Log your shifts and estimate gross pay for any pay period."
        actions={
          <button type="button" className="btn btn-primary" onClick={openAddModal}>
            <Plus size={15} aria-hidden="true" />
            Add shift
          </button>
        }
      />
      <div className="page-body">
        <div className="panel filter-bar">
          <div className="field filter">
            <label htmlFor="s-from">Pay period start</label>
            <input
              className="input"
              id="s-from"
              type="date"
              value={rangeStart}
              max={rangeEnd || undefined}
              onChange={(e) => setPayPeriod({ ...payPeriod, start: e.target.value })}
            />
          </div>
          <div className="field filter">
            <label htmlFor="s-to">Pay period end</label>
            <input
              className="input"
              id="s-to"
              type="date"
              value={rangeEnd}
              min={rangeStart || undefined}
              onChange={(e) => setPayPeriod({ ...payPeriod, end: e.target.value })}
            />
          </div>
          <div className="filter-summary">{rangeLabel}</div>
        </div>

        <div className="figure-grid">
          <div className="panel figure">
            <div className="figure-label">Estimated gross pay</div>
            <div className="figure-value">{formatCurrency(parseFloat(summary.estimated_gross_pay))}</div>
            <div className="figure-meta">before tax and deductions</div>
          </div>
          <div className="panel figure">
            <div className="figure-label">Total paid hours</div>
            <div className="figure-value">{parseFloat(summary.total_hours).toFixed(2)}</div>
            <div className="figure-meta">breaks excluded</div>
          </div>
          <div className="panel figure">
            <div className="figure-label">Shifts</div>
            <div className="figure-value">{summary.total_shifts}</div>
            <div className="figure-meta">in selected period</div>
          </div>
        </div>

        {error && <InlineError message={error} />}

        {loading ? (
          <div className="panel"><LoadingRow /></div>
        ) : shifts.length === 0 ? (
          <div className="panel panel-pad">
            <div className="empty-title">No shifts in this period</div>
            <p className="empty-body">Add a shift, or widen the pay period above to see shifts you have already logged.</p>
          </div>
        ) : (
          <div className="panel">
            <div className="table-scroll">
              <div className="grid-row grid-head shift-cols">
                <span>Date</span>
                <span>Start</span>
                <span>End</span>
                <span className="cell-right">Break</span>
                <span className="cell-right">Paid hours</span>
                <span className="cell-right">Rate</span>
                <span className="cell-right">Est. pay</span>
                <span className="cell-right">Actions</span>
              </div>
              {shifts.map((s) => (
                <div className="grid-row row-hover shift-cols" key={s.id}>
                  <span style={{ whiteSpace: 'nowrap' }}>{formatDateLabel(s.date)}</span>
                  <span className="cell-muted">{toTimeInputValue(s.start_time)}</span>
                  <span className="cell-muted">{toTimeInputValue(s.end_time)}</span>
                  <span className="cell-right cell-muted">{formatBreakLabel(s.break_minutes)}</span>
                  <span className="cell-right">{parseFloat(s.paid_hours).toFixed(2)}</span>
                  <span className="cell-right cell-muted">{formatCurrency(parseFloat(s.hourly_rate))}</span>
                  <span className="cell-right cell-strong">{formatCurrency(parseFloat(s.estimated_pay))}</span>
                  <span className="cell-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => openEditModal(s)}>Edit</button>
                    <button type="button" className="btn btn-ghost btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                  </span>
                </div>
              ))}
            </div>

            <div className="stack-cards">
              {shifts.map((s) => (
                <div className="stack-card" key={s.id}>
                  <div className="stack-card-top">
                    <div className="stack-card-title">{formatDateLabel(s.date)}</div>
                    <div className="stack-card-money">{formatCurrency(parseFloat(s.estimated_pay))}</div>
                  </div>
                  <div className="stack-card-meta">
                    {toTimeInputValue(s.start_time)} – {toTimeInputValue(s.end_time)} · {formatBreakLabel(s.break_minutes)} break ·{' '}
                    {parseFloat(s.paid_hours).toFixed(2)} h · {formatCurrency(parseFloat(s.hourly_rate))}/h
                  </div>
                  <div className="stack-card-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => openEditModal(s)}>Edit</button>
                    <button type="button" className="btn btn-ghost btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <ShiftModal
          key={modalShift ? modalShift.id : 'new'}
          initialShift={modalShift}
          defaultHourlyRate={defaultRate}
          onClose={() => setModalOpen(false)}
          onSaved={handleShiftSaved}
        />
      )}
    </>
  );
}
