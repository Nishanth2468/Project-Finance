import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useBudgets, Budget } from '@/hooks/useBudgets';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BudgetPage = () => {
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();
  const [formData, setFormData] = useState({ category: '', amount: 0 });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBudget) {
      updateBudget(editingBudget.id, formData);
      toast({ title: 'Success', description: 'Budget updated successfully' });
    } else {
      addBudget(formData);
      toast({ title: 'Success', description: 'Budget added successfully' });
    }
    setIsModalOpen(false);
    setFormData({ category: '', amount: 0 });
    setEditingBudget(undefined);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({ category: budget.category, amount: budget.amount });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteBudget(id);
    toast({ title: 'Success', description: 'Budget deleted successfully' });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-expense';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Budget Management</h1>
            <p className="text-muted-foreground">Set and track your spending limits</p>
          </div>
          <Button
            size="lg"
            onClick={() => {
              setEditingBudget(undefined);
              setFormData({ category: '', amount: 0 });
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Budget
          </Button>
        </div>

        {/* Budget Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.amount) * 100;
            const remaining = budget.amount - budget.spent;

            return (
              <Card key={budget.id} className={percentage >= 100 ? 'border-expense' : percentage >= 80 ? 'border-warning' : ''}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{budget.category}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(budget)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(budget.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold">${budget.spent.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">of ${budget.amount.toFixed(2)}</span>
                    </div>

                    <div className="space-y-2">
                      <Progress value={percentage} className={getProgressColor(percentage)} />
                      <div className="flex justify-between text-sm">
                        <span className={percentage >= 100 ? 'text-expense font-medium' : 'text-muted-foreground'}>
                          {percentage.toFixed(1)}% used
                        </span>
                        <span className={remaining < 0 ? 'text-expense font-medium' : 'text-success'}>
                          ${Math.abs(remaining).toFixed(2)} {remaining < 0 ? 'over' : 'left'}
                        </span>
                      </div>
                    </div>

                    {percentage >= 100 && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-expense/10 text-expense">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Budget exceeded!</span>
                      </div>
                    )}

                    {percentage >= 80 && percentage < 100 && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Approaching limit</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {budgets.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No budgets created yet</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Budget
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Budget Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBudget ? 'Edit Budget' : 'Create Budget'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingBudget ? 'Update' : 'Create'} Budget</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetPage;
