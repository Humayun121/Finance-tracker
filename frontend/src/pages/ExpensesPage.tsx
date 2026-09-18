import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories } from '../api/categories';
import { deleteExpense, getExpenses } from '../api/expenses';
import { ExpenseModal } from '../components/expenses/ExpenseModal';
import { PageHeader } from '../components/layout/PageHeader';
import { InlineError, LoadingRow } from '../components/ui/Feedback';
import type { Category, Expense } from '../types/models';
import { formatCurrency, formatShortDate, sumAmounts, toDateParam } from '../utils/dashboardStats';

function formatExpenseDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export function ExpensesPage() {
  const now = new Date();
  const [from, setFrom] = useState(toDateParam(new Date(now.getFullYear(), now.getMonth(), 1)));
  const [to, setTo] = useState(toDateParam(now));
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  useEffect(() => {
    getCategories().then(setCategories, () => setError('Could not load categories.'));
  }, []);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show a loading state while refetching after a filter change
    setLoading(true);
    setError(null);
    getExpenses({
      ...(from ? { start_date: from } : {}),
      ...(to ? { end_date: to } : {}),
      ...(categoryFilter ? { category: Number(categoryFilter) } : {}),
    })
      .then((data) => {
        if (!cancelled) setExpenses(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load expenses. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [from, to, categoryFilter, reloadKey]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditing(expense);
    setModalOpen(true);
  }

  function handleSaved() {
    setModalOpen(false);
    setReloadKey((k) => k + 1);
  }

  async function handleDelete(expense: Expense) {
    if (!window.confirm(`Delete "${expense.description || 'this expense'}"?`)) return;
    try {
      await deleteExpense(expense.id);
      setReloadKey((k) => k + 1);
    } catch {
      setError('Could not delete expense. Please try again.');
    }
  }

  const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const total = sumAmounts(sorted);
  const countLabel = sorted.length === 1 ? '1 expense' : `${sorted.length} expenses`;
  const categoryName = (id: number) => categories.find((c) => c.id === id)?.name ?? 'Uncategorised';

  return (
    <>
      <PageHeader
        title="Expenses"
        subtitle="Everything you have logged, filterable by date and category."
        actions={
          <button type="button" className="btn btn-primary" onClick={openAdd}>
            <Plus size={15} aria-hidden="true" />
            Add expense
          </button>
        }
      />
      <div className="page-body">
        <div className="panel filter-bar">
          <div className="field filter">
            <label htmlFor="e-from">From</label>
            <input className="input" id="e-from" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="field filter">
            <label htmlFor="e-to">To</label>
            <input className="input" id="e-to" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="field filter-wide">
            <label htmlFor="e-cat">Category</label>
            <select className="input" id="e-cat" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-summary" aria-live="polite">
            {loading ? '' : `${countLabel} · ${formatCurrency(total)}`}
          </div>
        </div>

        {error && <InlineError message={error} />}

        {loading ? (
          <div className="panel"><LoadingRow /></div>
        ) : sorted.length === 0 ? (
          <div className="panel panel-pad">
            <div className="empty-title">No expenses in this range</div>
            <p className="empty-body">Add an expense, or widen the dates and category filter above.</p>
          </div>
        ) : (
          <div className="panel">
            <div className="table-scroll">
              <div className="grid-row grid-head exp-cols">
                <span>Date</span>
                <span>Description</span>
                <span>Category</span>
                <span className="cell-right">Amount</span>
                <span className="cell-right">Actions</span>
              </div>
              {sorted.map((e) => (
                <div className="grid-row row-hover exp-cols" key={e.id}>
                  <span className="cell-muted" style={{ whiteSpace: 'nowrap' }}>{formatExpenseDate(e.date)}</span>
                  <span style={{ overflowWrap: 'anywhere' }}>{e.description || '—'}</span>
                  <span className="cell-muted" style={{ fontSize: 12 }}>{categoryName(e.category)}</span>
                  <span className="cell-right cell-strong">{formatCurrency(parseFloat(e.amount))}</span>
                  <span className="cell-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => openEdit(e)}>Edit</button>
                    <button type="button" className="btn btn-danger btn-ghost" onClick={() => handleDelete(e)}>Delete</button>
                  </span>
                </div>
              ))}
            </div>

            <div className="stack-cards">
              {sorted.map((e) => (
                <div className="stack-card" key={e.id}>
                  <div className="stack-card-top">
                    <div className="stack-card-title">{e.description || categoryName(e.category)}</div>
                    <div className="stack-card-money">{formatCurrency(parseFloat(e.amount))}</div>
                  </div>
                  <div className="stack-card-meta">
                    {categoryName(e.category)} · {formatShortDate(new Date(e.date))}
                  </div>
                  <div className="stack-card-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => openEdit(e)}>Edit</button>
                    <button type="button" className="btn btn-danger btn-ghost" onClick={() => handleDelete(e)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="table-foot">
              <span>{countLabel} in range</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <ExpenseModal
          initialExpense={editing}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
