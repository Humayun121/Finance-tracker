import type { Category } from '../types/models';
import { apiFetch } from './client';

export async function getCategories(): Promise<Category[]> {
  const res = await apiFetch('/api/categories/');
  return res.json();
}

export async function createCategory(name: string): Promise<Category> {
  const res = await apiFetch('/api/categories/', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  await apiFetch(`/api/categories/${id}/`, {
    method: 'DELETE',
  });
}