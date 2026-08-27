import type { Expense, CreateExpense  } from '../types/models';
import { apiFetch } from './client';

interface GetExpensesParams {
  start_date?: string;
  end_date?: string;
}

export async function getExpenses(params: GetExpensesParams = {}): Promise<Expense[]> {
  const query = new URLSearchParams();
  if (params.start_date) query.set('start_date', params.start_date);
  if (params.end_date) query.set('end_date', params.end_date);

  const qs = query.toString();
  const res = await apiFetch(`/api/expenses/${qs ? `?${qs}` : ''}`);
  return res.json();
}

export async function createExpense(
  expense: CreateExpense
): Promise<Expense> {
  const res = await apiFetch('/api/expenses/', {
    method: 'POST',
    body: JSON.stringify(expense),
  });

  return res.json();
}

export async function deleteExpense(id: number): Promise<void> {
  await apiFetch(`/api/expenses/${id}/`, {
    method: 'DELETE',
  });
}