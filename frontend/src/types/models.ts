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
