export interface Account {
  id: string;
  name: string;
  type: 'Checking' | 'Savings' | 'Investment' | 'External';
  accountNumber: string;
  balance: number;
  change: number; // Daily change percentage
  status?: 'active' | 'pending_verification';
  institution?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'posted' | 'pending';
  merchantLogo?: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}