import { useState, useEffect } from 'react';

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('finance_budgets');
    if (stored) {
      setBudgets(JSON.parse(stored));
    } else {
      // Sample data
      const sampleData: Budget[] = [
        { id: '1', category: 'Groceries', amount: 500, spent: 120 },
        { id: '2', category: 'Entertainment', amount: 200, spent: 50 },
        { id: '3', category: 'Rent', amount: 1000, spent: 850 },
        { id: '4', category: 'Utilities', amount: 150, spent: 0 },
      ];
      setBudgets(sampleData);
      localStorage.setItem('finance_budgets', JSON.stringify(sampleData));
    }
  }, []);

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget = { ...budget, id: Date.now().toString(), spent: 0 };
    const updated = [...budgets, newBudget];
    setBudgets(updated);
    localStorage.setItem('finance_budgets', JSON.stringify(updated));
  };

  const updateBudget = (id: string, budget: Partial<Budget>) => {
    const updated = budgets.map(b => (b.id === id ? { ...b, ...budget } : b));
    setBudgets(updated);
    localStorage.setItem('finance_budgets', JSON.stringify(updated));
  };

  const deleteBudget = (id: string) => {
    const updated = budgets.filter(b => b.id !== id);
    setBudgets(updated);
    localStorage.setItem('finance_budgets', JSON.stringify(updated));
  };

  return { budgets, addBudget, updateBudget, deleteBudget };
};
