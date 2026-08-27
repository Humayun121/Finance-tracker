import { Nav } from '../components/layout/Nav';
import type { Expense, Category } from '../types/models';
import { useEffect, useState } from 'react';
import { getCategories } from '../api/categories';
import { getExpenses, createExpense , deleteExpense } from '../api/expenses';


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

  return (
    <div>
      <Nav />
      <div style={{ padding: 'var(--space-8)' }}>
        <h1>Expenses</h1>

        <select
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

        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <button onClick={handleAddExpense}>
          Add Expense
        </button>

        {expenses.map((expense) => {
        const matchedCategory = categories.find(
          (category) => category.id === expense.category
        );

        return (
          <div key={expense.id}>
            <p>
              £{expense.amount} | {expense.description} | {matchedCategory?.name} | {expense.date}
            </p>

            <button onClick={() => handleDeleteExpense(expense.id)}>
              Delete
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );
}
