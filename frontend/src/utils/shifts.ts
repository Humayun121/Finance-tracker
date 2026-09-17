export function computePaidHours(start: string, end: string, breakMinutes: number): number {
  if (!start || !end) return 0;

  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  let minutes = toMinutes(end) - toMinutes(start);
  if (minutes < 0) minutes += 24 * 60;
  minutes -= breakMinutes || 0;

  return Math.max(0, minutes) / 60;
}

export function formatDateLabel(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatBreakLabel(minutes: number): string {
  return minutes ? `${minutes} min` : '—';
}

export function toTimeInputValue(time: string): string {
  return time.slice(0, 5);
}
