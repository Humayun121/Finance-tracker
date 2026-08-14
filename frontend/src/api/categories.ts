import type { Category } from '../types/models';
import { apiFetch } from './client';

export async function getCategories(): Promise<Category[]> {
  const res = await apiFetch('/api/categories/');
  return res.json();
}
