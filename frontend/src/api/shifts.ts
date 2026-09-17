import type { CreateShift, Shift, ShiftSummary } from '../types/models';
import { apiFetch } from './client';

interface ShiftRangeParams {
  start_date?: string;
  end_date?: string;
}

function buildRangeQuery(params: ShiftRangeParams): string {
  const query = new URLSearchParams();
  if (params.start_date) query.set('start_date', params.start_date);
  if (params.end_date) query.set('end_date', params.end_date);

  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export async function getShifts(params: ShiftRangeParams = {}): Promise<Shift[]> {
  const res = await apiFetch(`/api/shifts/${buildRangeQuery(params)}`);
  return res.json();
}

export async function getShiftSummary(params: ShiftRangeParams = {}): Promise<ShiftSummary> {
  const res = await apiFetch(`/api/shifts/summary/${buildRangeQuery(params)}`);
  return res.json();
}

export async function getShiftDefaults(): Promise<{ hourly_rate: string | null }> {
  const res = await apiFetch('/api/shifts/defaults/');
  return res.json();
}

export async function createShift(shift: CreateShift): Promise<Shift> {
  const res = await apiFetch('/api/shifts/', {
    method: 'POST',
    body: JSON.stringify(shift),
  });

  return res.json();
}

export async function updateShift(id: number, shift: CreateShift): Promise<Shift> {
  const res = await apiFetch(`/api/shifts/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(shift),
  });

  return res.json();
}

export async function deleteShift(id: number): Promise<void> {
  await apiFetch(`/api/shifts/${id}/`, {
    method: 'DELETE',
  });
}
