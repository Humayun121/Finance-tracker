import { Plus } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { createCategory, deleteCategory, getCategories } from '../api/categories';
import { getExpenses } from '../api/expenses';
import { PageHeader } from '../components/layout/PageHeader';
import { InlineError, LoadingRow } from '../components/ui/Feedback';
import type { Category } from '../types/models';

function usageLabel(count: number): string {
  return count === 1 ? '1 expense' : `${count} expenses`;
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [usage, setUsage] = useState<Map<number, number>>(new Map());
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const [cats, expenses] = await Promise.all([getCategories(), getExpenses()]);
      const counts = new Map<number, number>();
      for (const e of expenses) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
      setCategories(cats);
      setUsage(counts);
    } catch {
      setError('Could not load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    load();
  }, []);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    const name = draft.trim();
    if (!name) return;

    setAdding(true);
    setError(null);
    try {
      const created = await createCategory(name);
      setCategories((prev) => [...prev, created]);
      setDraft('');
    } catch {
      setError('Could not add category. Please try again.');
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(category: Category) {
    const count = usage.get(category.id) ?? 0;
    const warning = count > 0
      ? `Delete "${category.name}"? Its ${usageLabel(count)} will be deleted too.`
      : `Delete "${category.name}"?`;
    if (!window.confirm(warning)) return;

    setError(null);
    try {
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    } catch {
      setError('Could not delete category. Please try again.');
    }
  }

  const countLabel = categories.length === 1 ? '1 category' : `${categories.length} categories`;

  return (
    <>
      <PageHeader title="Categories" subtitle="Categories are used to organise your expenses." />
      <div className="page-body page-body-narrow">
        <div className="panel panel-pad">
          <form className="inline-form" onSubmit={handleAdd}>
            <div className="field">
              <label htmlFor="c-new">New category</label>
              <input
                className="input"
                id="c-new"
                type="text"
                maxLength={200}
                placeholder="e.g. Groceries"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={!draft.trim() || adding}>
              <Plus size={15} aria-hidden="true" />
              Add category
            </button>
          </form>
        </div>

        {error && <InlineError message={error} />}

        {loading ? (
          <div className="panel"><LoadingRow /></div>
        ) : categories.length > 0 ? (
          <div className="panel">
            <div className="panel-head panel-head-ruled">
              <div className="panel-title">All categories</div>
              <span className="panel-sub">{countLabel}</span>
            </div>
            {categories.map((c) => (
              <div className="cat-row row-hover" key={c.id}>
                <div>
                  <div className="cat-row-name">{c.name}</div>
                  <div className="cat-row-usage">{usageLabel(usage.get(c.id) ?? 0)}</div>
                </div>
                <button type="button" className="btn btn-ghost btn-danger" onClick={() => handleDelete(c)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="panel panel-pad">
            <div className="empty-title">No categories yet</div>
            <p className="empty-body">Add your first category above to start grouping your expenses.</p>
          </div>
        )}
      </div>
    </>
  );
}
