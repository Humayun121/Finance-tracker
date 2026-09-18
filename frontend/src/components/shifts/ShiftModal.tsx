import { useRef, useState, type FormEvent } from 'react';
import { createShift, updateShift } from '../../api/shifts';
import type { CreateShift, Shift } from '../../types/models';
import { formatCurrency } from '../../utils/dashboardStats';
import { computePaidHours, toTimeInputValue } from '../../utils/shifts';
import { InlineError } from '../ui/Feedback';
import { useEscapeToClose } from '../ui/useDialog';

interface ShiftModalProps {
  initialShift: Shift | null;
  defaultHourlyRate: string;
  onClose: () => void;
  onSaved: (saved: Shift, keepOpen: boolean) => void;
}

/** One modal for both adding and editing a shift. */
export function ShiftModal({ initialShift, defaultHourlyRate, onClose, onSaved }: ShiftModalProps) {
  const [editingShift, setEditingShift] = useState<Shift | null>(initialShift);
  const [date, setDate] = useState(initialShift?.date ?? '');
  const [startTime, setStartTime] = useState(initialShift ? toTimeInputValue(initialShift.start_time) : '09:00');
  const [endTime, setEndTime] = useState(initialShift ? toTimeInputValue(initialShift.end_time) : '17:00');
  const [breakMinutes, setBreakMinutes] = useState(String(initialShift?.break_minutes ?? 30));
  const [hourlyRate, setHourlyRate] = useState(initialShift?.hourly_rate ?? defaultHourlyRate ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEscapeToClose(onClose);

  // Client-side preview only; the saved values are calculated by the server.
  const previewHours = computePaidHours(startTime, endTime, Number(breakMinutes) || 0);
  const previewPay = previewHours * (Number(hourlyRate) || 0);

  const isEditing = editingShift !== null;
  const showRateHint = !isEditing && defaultHourlyRate !== '' && hourlyRate === defaultHourlyRate;
  const canSave = date !== '' && startTime !== '' && endTime !== '' && hourlyRate !== '' && !saving;

  async function save(keepOpen: boolean) {
    if (!canSave) return;

    setSaving(true);
    setError(null);

    const payload: CreateShift = {
      date,
      start_time: startTime,
      end_time: endTime,
      break_minutes: Number(breakMinutes) || 0,
      hourly_rate: hourlyRate,
    };

    try {
      const saved = editingShift ? await updateShift(editingShift.id, payload) : await createShift(payload);
      onSaved(saved, keepOpen);

      if (keepOpen) {
        // Clear only the date and put the cursor back there for the next entry.
        setEditingShift(null);
        setDate('');
        dateInputRef.current?.focus();
      }
    } catch {
      setError('Could not save shift. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    save(false);
  }

  return (
    <div
      className="dialog-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form className="dialog" role="dialog" aria-modal="true" aria-labelledby="shift-modal-title" onSubmit={handleSubmit}>
        <div className="dialog-head">
          <div className="dialog-title" id="shift-modal-title">{isEditing ? 'Edit shift' : 'Add shift'}</div>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>

        <div className="dialog-body">
          <div className="field">
            <label htmlFor="shift-date">Date</label>
            <input
              ref={dateInputRef}
              className="input"
              id="shift-date"
              type="date"
              autoFocus
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field field-pair">
              <label htmlFor="shift-start">Start time</label>
              <input className="input" id="shift-start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="field field-pair">
              <label htmlFor="shift-end">End time</label>
              <input className="input" id="shift-end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              {endTime !== '' && startTime !== '' && endTime < startTime && (
                <div className="field-hint">Ends after midnight (overnight shift)</div>
              )}
            </div>
          </div>

          <div className="field-row">
            <div className="field field-pair">
              <label htmlFor="shift-break">Break (minutes)</label>
              <input
                className="input"
                id="shift-break"
                type="number"
                min="0"
                step="5"
                inputMode="numeric"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(e.target.value)}
              />
            </div>
            <div className="field field-pair">
              <label htmlFor="shift-rate">Hourly rate (£)</label>
              <input
                className="input"
                id="shift-rate"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
              {showRateHint && <div className="field-hint">Pre-filled from your last shift</div>}
            </div>
          </div>

          <div className="calc-box">
            <div>
              <div className="calc-label">Paid hours</div>
              <div className="calc-value" aria-live="polite">{previewHours.toFixed(2)}</div>
            </div>
            <div>
              <div className="calc-label">Estimated pay</div>
              <div className="calc-value" aria-live="polite">{formatCurrency(previewPay)}</div>
            </div>
            <div className="calc-note">Calculated automatically</div>
          </div>
        </div>

        {error && <div className="dialog-error"><InlineError message={error} /></div>}
        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" disabled={!canSave} onClick={() => save(true)}>
            Save &amp; add another
          </button>
          <button type="submit" className="btn btn-primary" disabled={!canSave}>
            {isEditing ? 'Save changes' : 'Save shift'}
          </button>
        </div>
      </form>
    </div>
  );
}
