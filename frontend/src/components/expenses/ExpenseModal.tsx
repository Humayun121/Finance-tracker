import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createExpense, updateExpense } from '../../api/expenses';
import type { Category, CreateExpense, Expense } from '../../types/models';
import { toDateParam } from '../../utils/dashboardStats';
import { InlineError } from '../ui/Feedback';
import { useEscapeToClose } from '../ui/useDialog';

interface ExpenseModalProps {
  initialExpense: Expense | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (saved: Expense) => void;
}

export function ExpenseModal({ initialExpense, categories, onClose, onSaved }: ExpenseModalProps) {
  const [category, setCategory] = useState(initialExpense ? String(initialExpense.category) : '');
  const [amount, setAmount] = useState(initialExpense?.amount ?? '');
  const [description, setDescription] = useState(initialExpense?.description ?? '');
  const [date, setDate] = useState(
    initialExpense ? toDateParam(new Date(initialExpense.date)) : toDateParam(new Date()),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLSelectElement>(null);

  useEscapeToClose(onClose);
  useEffect(() => firstFieldRef.current?.focus(), []);

  const isEditing = initialExpense !== null;
  const canSave = category !== '' && Number(amount) > 0 && date !== '' && !saving;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSave) return;

    setSaving(true);
    setError(null);

    const payload: CreateExpense = { amount, category: Number(category), description: description.trim(), date };

    try {
      const saved = initialExpense
        ? await updateExpense(initialExpense.id, payload)
        : await createExpense(payload);
      onSaved(saved);
    } catch {
      setError('Could not save expense. Please try again.');
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
      <form className="dialog" role="dialog" aria-modal="true" aria-labelledby="expense-modal-title" onSubmit={handleSubmit}>
        <div className="dialog-head">
          <div className="dialog-title" id="expense-modal-title">{isEditing ? 'Edit expense' : 'Add expense'}</div>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>

        <div className="dialog-body">
          {categories.length === 0 && (
            <p className="inline-error">
              You need a category first. <Link to="/categories">Add one</Link>.
            </p>
          )}
          <div className="field">
            <label htmlFor="expense-category">Category</label>
            <select
              ref={firstFieldRef}
              id="expense-category"
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="field-row">
            <div className="field field-pair">
              <label htmlFor="expense-amount">Amount (£)</label>
              <input
                id="expense-amount"
                className="input"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="field field-pair">
              <label htmlFor="expense-date">Date</label>
              <input id="expense-date" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="expense-description">Description</label>
            <input
              id="expense-description"
              className="input"
              type="text"
              maxLength={225}
              placeholder="e.g. Weekly shop"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="dialog-error"><InlineError message={error} /></div>}
        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!canSave}>
            {isEditing ? 'Save changes' : 'Save expense'}
          </button>
        </div>
      </form>
    </div>
  );
}
