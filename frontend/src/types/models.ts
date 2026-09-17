export interface Category {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  amount: string;
  category: number;
  description: string;
  date: string;
}

export interface CreateExpense {
  amount: string;
  category: number;
  description: string;
  date: string;
}

export interface Shift {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  break_minutes: number;
  hourly_rate: string;
  paid_hours: string;
  estimated_pay: string;
}

export interface CreateShift {
  date: string;
  start_time: string;
  end_time: string;
  break_minutes: number;
  hourly_rate: string;
}

export interface ShiftSummary {
  total_shifts: number;
  total_hours: string;
  estimated_gross_pay: string;
}