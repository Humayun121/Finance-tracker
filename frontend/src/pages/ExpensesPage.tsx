import { Nav } from '../components/layout/Nav';
import type { Expense, Category } from '../types/models';
import { useEffect, useState } from 'react';
import { getCategories } from '../api/categories';
import { getExpenses, createExpense , deleteExpense } from '../api/expenses';
import { formatCurrency } from '../utils/dashboardStats';


export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]> ([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    async function fetchExpenses() {
      const data = await getExpenses();
      setExpenses(data);
    }

    async function fetchCategories() {
      const data = await getCategories();
      setCategories(data);
    }

    fetchExpenses();
    fetchCategories();
  }, []);

  async function handleAddExpense() {
    if (!amount || !selectedCategory || !description.trim() || !date) {
      return;
    }

    const createdExpense = await createExpense({
      amount,
      category: Number(selectedCategory),
      description,
      date,
    });

    setExpenses([...expenses, createdExpense]);
    setAmount('');
    setSelectedCategory('');
    setDescription('');
    setDate('');
  }

  async function handleDeleteExpense(id: number) {
    await deleteExpense(id);

    setExpenses(
      expenses.filter((expense) => expense.id !== id)
    );
  }

  const hasExpenses = expenses.length > 0;
  const countLabel = expenses.length === 1 ? '1 expense' : `${expenses.length} expenses`;

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
        <h1 style={{ marginBottom: 2 }}>Expenses</h1>
        <div className="text-muted">Track and manage your spending.</div>

        <hr className="hr" />

        <div className="card elev-sm">
          <form
            style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'flex-end' }}
            onSubmit={(event) => {
              event.preventDefault();
              handleAddExpense();
            }}
          >
            <div className="field" style={{ flex: '1 1 160px', minWidth: 0, margin: 0 }}>
              <label htmlFor="expense-category">Category</label>
              <select
                className="input"
                id="expense-category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field" style={{ flex: '1 1 110px', minWidth: 0, margin: 0 }}>
              <label htmlFor="expense-amount">Amount</label>
              <input
                className="input"
                id="expense-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>

            <div className="field" style={{ flex: '2 1 200px', minWidth: 0, margin: 0 }}>
              <label htmlFor="expense-description">Description</label>
              <input
                className="input"
                id="expense-description"
                type="text"
                placeholder="e.g. Weekly shop"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="field" style={{ flex: '1 1 150px', minWidth: 0, margin: 0 }}>
              <label htmlFor="expense-date">Date</label>
              <input
                className="input"
                id="expense-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>

            <button className="btn btn-primary" type="submit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add expense
            </button>
          </form>
        </div>

        {hasExpenses ? (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--space-3)' }}>
              <h4 style={{ margin: 0 }}>All expenses</h4>
              <span className="text-muted" style={{ fontSize: 12 }}>{countLabel}</span>
            </div>
            <div className="card elev-sm" style={{ padding: 0 }}>
              {expenses.map((expense) => {
                const matchedCategory = categories.find(
                  (category) => category.id === expense.category
                );

                return (
                  <div
                    key={expense.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--space-4)',
                      padding: 'var(--space-3) var(--space-4)',
                      borderTop: '1px solid var(--color-divider)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 15 }}>{expense.description}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>
                        {matchedCategory?.name ?? 'Uncategorised'} · {expense.date}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                        {formatCurrency(parseFloat(expense.amount))}
                      </span>
                      <button
                        className="btn btn-ghost"
                        style={{ color: 'var(--color-accent-700)' }}
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card elev-sm" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-8) var(--space-6)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 'var(--space-3)' }}><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <h4 style={{ marginBottom: 'var(--space-1)' }}>No expenses yet</h4>
            <p className="text-muted" style={{ margin: 0, maxWidth: '44ch' }}>Add your first expense above to start tracking your spending.</p>
          </div>
        )}
      </div>
    </div>
  );
}
