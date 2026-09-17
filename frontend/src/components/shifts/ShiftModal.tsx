import { useEffect, useRef, useState } from 'react';
import { createShift, updateShift } from '../../api/shifts';
import type { CreateShift, Shift } from '../../types/models';
import { formatCurrency } from '../../utils/dashboardStats';
import { computePaidHours, toTimeInputValue } from '../../utils/shifts';

interface ShiftModalProps {
  initialShift: Shift | null;
  defaultHourlyRate: string;
  onClose: () => void;
  onSaved: (saved: Shift, keepOpen: boolean) => void;
}

export function ShiftModal({ initialShift, defaultHourlyRate, onClose, onSaved }: ShiftModalProps) {
  const [editingShift, setEditingShift] = useState<Shift | null>(initialShift);
  const [date, setDate] = useState(initialShift?.date ?? '');
  const [startTime, setStartTime] = useState(
    initialShift ? toTimeInputValue(initialShift.start_time) : '09:00'
  );
  const [endTime, setEndTime] = useState(
    initialShift ? toTimeInputValue(initialShift.end_time) : '17:00'
  );
  const [breakMinutes, setBreakMinutes] = useState(String(initialShift?.break_minutes ?? 30));
  const [hourlyRate, setHourlyRate] = useState(initialShift?.hourly_rate ?? defaultHourlyRate ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const previewHours = computePaidHours(startTime, endTime, Number(breakMinutes) || 0);
  const previewPay = previewHours * (Number(hourlyRate) || 0);

  const isEditing = editingShift !== null;
  const canSave = date.trim().length > 0 && !saving;

  async function handleSubmit(keepOpen: boolean) {
    if (!date) return;

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
      const saved = editingShift
        ? await updateShift(editingShift.id, payload)
        : await createShift(payload);

      onSaved(saved, keepOpen);

      if (keepOpen) {
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

  return (
    <div
      className="dialog-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog elev-lg" role="dialog" aria-modal="true" aria-labelledby="shift-modal-title">
        <div className="dialog-title">
          <span id="shift-modal-title">{isEditing ? 'Edit shift' : 'Add shift'}</span>
          <button type="button" className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={onClose}>
            Close
          </button>
        </div>

        <div className="dialog-body">
          <div className="field">
            <label htmlFor="shift-date">Date</label>
            <input
              ref={dateInputRef}
              className="input"
              id="shift-date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="field-row">
            <div className="field field-pair">
              <label htmlFor="shift-start">Start time</label>
              <input
                className="input"
                id="shift-start"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>
            <div className="field field-pair">
              <label htmlFor="shift-end">End time</label>
              <input
                className="input"
                id="shift-end"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
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
                onChange={(event) => setBreakMinutes(event.target.value)}
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
                onChange={(event) => setHourlyRate(event.target.value)}
              />
              <div className="text-muted" style={{ fontSize: 11, marginTop: 4 }}>
                Pre-filled from your last shift
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-6)',
              borderTop: '2px solid var(--color-divider)',
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-4)',
            }}
          >
            <div>
              <div className="card-kicker">Paid hours</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 24 }}>
                {previewHours.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="card-kicker">Estimated pay</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 24 }}>
                {formatCurrency(previewPay)}
              </div>
            </div>
            <div className="text-muted" style={{ alignSelf: 'flex-end', fontSize: 11 }}>
              Calculated automatically
            </div>
          </div>

          {error && (
            <div className="text-muted" style={{ color: 'var(--color-accent)', fontSize: 13, marginTop: 'var(--space-3)' }}>
              {error}
            </div>
          )}
        </div>

        <div className="dialog-actions">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={!canSave}
            onClick={() => handleSubmit(true)}
          >
            Save &amp; add another
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canSave}
            onClick={() => handleSubmit(false)}
          >
            {isEditing ? 'Save changes' : 'Save shift'}
          </button>
        </div>
      </div>
    </div>
  );
}
