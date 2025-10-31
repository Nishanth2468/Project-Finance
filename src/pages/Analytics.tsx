import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';

const Analytics = () => {
  const { transactions } = useTransactions();
  const [timePeriod, setTimePeriod] = useState('this-month');

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // Category spending breakdown
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        acc.push({ name: t.category, value: t.amount });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value);

  // Monthly comparison data (mock data for demonstration)
  const monthlyData = [
    { month: 'Jan', income: 3500, expense: 2800 },
    { month: 'Feb', income: 3700, expense: 3100 },
    { month: 'Mar', income: 3500, expense: 2600 },
    { month: 'Apr', income: 4000, expense: 3200 },
    { month: 'May', income: 3800, expense: 2900 },
    { month: 'Jun', income: 3900, expense: 3300 },
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const insights = [
    {
      title: 'Top Spending Category',
      value: categoryData[0]?.name || 'N/A',
      amount: categoryData[0]?.value || 0,
      trend: 'up',
    },
    {
      title: 'Average Daily Spending',
      value: `$${(totalExpenses / 30).toFixed(2)}`,
      amount: totalExpenses / 30,
      trend: 'down',
    },
    {
      title: 'Savings Rate',
      value: `${((totalIncome - totalExpenses) / totalIncome * 100 || 0).toFixed(1)}%`,
      amount: totalIncome - totalExpenses,
      trend: totalIncome > totalExpenses ? 'up' : 'down',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Insights and trends for your finances</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {insights.map((insight, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                {insight.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-expense" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insight.value}</div>
                {typeof insight.amount === 'number' && insight.amount > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">${insight.amount.toFixed(2)}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Income vs Expense Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expense Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="hsl(var(--income))" strokeWidth={2} name="Income" />
                  <Line type="monotone" dataKey="expense" stroke="hsl(var(--expense))" strokeWidth={2} name="Expense" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category Details */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Spending Insights */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Spending Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h3 className="font-semibold mb-2">💡 Saving Opportunity</h3>
                <p className="text-sm text-muted-foreground">
                  You're spending {((totalExpenses / totalIncome) * 100).toFixed(0)}% of your income. Try to keep it under 70% to increase your savings.
                </p>
              </div>

              {categoryData[0] && (
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <h3 className="font-semibold mb-2">⚠️ Top Expense</h3>
                  <p className="text-sm text-muted-foreground">
                    Your highest expense category is {categoryData[0].name} at ${categoryData[0].value.toFixed(2)}. Consider reviewing these expenses.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <h3 className="font-semibold mb-2">✅ Good Job!</h3>
                <p className="text-sm text-muted-foreground">
                  You've tracked {transactions.length} transactions. Consistent tracking helps you make better financial decisions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
