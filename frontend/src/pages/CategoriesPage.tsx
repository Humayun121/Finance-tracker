import { Nav } from '../components/layout/Nav';
import type { Category } from '../types/models';
import { createCategory, deleteCategory, getCategories } from '../api/categories';
import { useEffect, useState } from 'react';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  async function handleAddCategory() {
    const trimmedCategory = newCategory.trim()

    if (!trimmedCategory) {
      return;
    }

    const createdCategory = await createCategory(trimmedCategory);

    setCategories([...categories, createdCategory]);
    setNewCategory('');
  }

  async function handleDeleteCategory(id: number) {
    await deleteCategory(id);

    setCategories(
      categories.filter((category)=> category.id !==id)
    );
  }

  const hasCategories = categories.length > 0;
  const countLabel = categories.length === 1 ? '1 category' : `${categories.length} categories`;

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

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
        <h1 style={{ marginBottom: 2 }}>Categories</h1>
        <div className="text-muted">Categories are used to organise your expenses.</div>

        <hr className="hr" />

        <div className="card elev-sm">
          <form
            style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'flex-end' }}
            onSubmit={(event) => {
              event.preventDefault();
              handleAddCategory();
            }}
          >
            <div className="field" style={{ flex: '1 1 260px', minWidth: 0, margin: 0 }}>
              <label htmlFor="new-category">New category</label>
              <input
                className="input"
                id="new-category"
                type="text"
                placeholder="e.g. Groceries"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add category
            </button>
          </form>
        </div>

        {hasCategories ? (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-3)' }}>
              <h4 style={{ margin: 0 }}>All categories</h4>
              <span className="text-muted" style={{ fontSize: 12 }}>{countLabel}</span>
            </div>
            <div className="card elev-sm" style={{ padding: 0 }}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderTop: '1px solid var(--color-divider)',
                  }}
                >
                  <span style={{ fontSize: 15 }}>{category.name}</span>
                  <button
                    className="btn btn-ghost"
                    style={{ color: 'var(--color-accent-700)' }}
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card elev-sm" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-8) var(--space-6)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 'var(--space-3)' }}><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42Z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>
            <h4 style={{ marginBottom: 'var(--space-1)' }}>No categories yet</h4>
            <p className="text-muted" style={{ margin: 0, maxWidth: '44ch' }}>Add your first category above to start grouping your expenses.</p>
          </div>
        )}
      </div>
    </div>
  );
}
