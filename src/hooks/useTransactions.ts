import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('finance_transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      // Sample data
      const sampleData: Transaction[] = [
        { id: '1', amount: 3500, category: 'Salary', date: '2025-01-01', description: 'Monthly salary', type: 'income' },
        { id: '2', amount: 850, category: 'Rent', date: '2025-01-05', description: 'Monthly rent payment', type: 'expense' },
        { id: '3', amount: 120, category: 'Groceries', date: '2025-01-08', description: 'Weekly groceries', type: 'expense' },
        { id: '4', amount: 50, category: 'Entertainment', date: '2025-01-10', description: 'Movie tickets', type: 'expense' },
        { id: '5', amount: 200, category: 'Freelance', date: '2025-01-15', description: 'Design project', type: 'income' },
      ];
      setTransactions(sampleData);
      localStorage.setItem('finance_transactions', JSON.stringify(sampleData));
    }
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem('finance_transactions', JSON.stringify(updated));
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    const updated = transactions.map(t => (t.id === id ? { ...t, ...transaction } : t));
    setTransactions(updated);
    localStorage.setItem('finance_transactions', JSON.stringify(updated));
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('finance_transactions', JSON.stringify(updated));
  };

  return { transactions, addTransaction, updateTransaction, deleteTransaction };
};
