import { Account, Transaction } from './types';

export const USER_NAME = "Howard Woods";

export const ACCOUNTS: Account[] = [
  {
    id: 'acct-1',
    name: 'Private Client Checking',
    type: 'Checking',
    accountNumber: '•••• 8842',
    balance: 500000.00,
    change: 0.05
  },
  {
    id: 'acct-2',
    name: 'Premier Platinum Checking',
    type: 'Checking',
    accountNumber: '•••• 1293',
    balance: 250000.00,
    change: -0.12
  },
  {
    id: 'acct-3',
    name: 'Operating Expenses',
    type: 'Checking',
    accountNumber: '•••• 5521',
    balance: 150000.00,
    change: 0.00
  },
  {
    id: 'acct-4',
    name: 'Estate Management Fund',
    type: 'Checking',
    accountNumber: '•••• 9931',
    balance: 65731.00,
    change: 1.2
  }
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-tax-1',
    date: '2025-11-21',
    description: 'Freedom Mortgage Loan',
    category: 'Mortgage Taxes',
    amount: 1650.00,
    type: 'debit',
    status: 'posted'
  },
  {
    id: 'tx-0',
    date: '2025-11-20',
    description: 'FREEDOM MORTGAGE BANK',
    category: 'Mortgage',
    amount: 49764.00,
    type: 'debit',
    status: 'posted'
  },
  {
    id: 'tx-1',
    date: '2024-05-22',
    description: 'Tech Ventures Capital Call',
    category: 'Investment',
    amount: 250000.00,
    type: 'debit',
    status: 'posted'
  },
  {
    id: 'tx-2',
    date: '2024-05-21',
    description: 'Starbucks Coffee',
    category: 'Dining',
    amount: 2.00,
    type: 'debit',
    status: 'posted'
  },
  {
    id: 'tx-3',
    date: '2024-05-21',
    description: 'Dividend Payout - Apple Inc',
    category: 'Income',
    amount: 15420.50,
    type: 'credit',
    status: 'posted'
  },
  {
    id: 'tx-4',
    date: '2024-05-20',
    description: 'Executive Jet Aviation',
    category: 'Travel',
    amount: 12500.00,
    type: 'debit',
    status: 'posted'
  },
  {
    id: 'tx-5',
    date: '2024-05-19',
    description: 'The Ritz-Carlton',
    category: 'Travel',
    amount: 4200.00,
    type: 'debit',
    status: 'posted'
  },
  {
    id: 'tx-6',
    date: '2024-05-18',
    description: 'Whole Foods Market',
    category: 'Groceries',
    amount: 2.00,
    type: 'debit',
    status: 'posted'
  },
  {
    id: 'tx-7',
    date: '2024-05-18',
    description: 'Tesla Supercharger',
    category: 'Transport',
    amount: 32.50,
    type: 'debit',
    status: 'posted'
  }
];

export const SPENDING_DATA = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 250000 }, // Spike from investment
  { name: 'Jun', value: 55000 },
];