import { useState } from 'react';
import { startOfDay, toDateParam } from './dashboardStats';

const STORAGE_KEY = 'pay-period';

export interface PayPeriod {
  start: string;
  end: string;
}

function defaultPeriod(): PayPeriod {
  const now = new Date();
  return {
    start: toDateParam(new Date(now.getFullYear(), now.getMonth(), 1)),
    end: toDateParam(startOfDay(now)),
  };
}

function load(): PayPeriod {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.start === 'string' && typeof parsed?.end === 'string') return parsed;
    }
  } catch {
    // storage unavailable or corrupt; fall back to the default
  }
  return defaultPeriod();
}

/** The user's chosen pay period, remembered in the browser and shared by Shifts and Dashboard. */
export function usePayPeriod(): [PayPeriod, (next: PayPeriod) => void] {
  const [period, setPeriod] = useState<PayPeriod>(load);

  function update(next: PayPeriod) {
    setPeriod(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore: the choice just won't persist
    }
  }

  return [period, update];
}
