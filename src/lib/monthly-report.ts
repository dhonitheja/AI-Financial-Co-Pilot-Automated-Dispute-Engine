import { Transaction } from './data';

export interface MonthlyReportData {
  totalSpend: number;
  totalIncome: number;
  hiddenFees: number;
  categoryBreakdown: Record<string, number>;
  accountUtilization: Record<string, number>;
  merchantBreaches: { merchant: string; limit: number; current: number }[];
  creditCardUtilization: { account: string; balance: number; limit: number; utilization: number }[];
  savingsFromDisputes: number;
}

export function aggregateMonthlyData(transactions: any[], alerts: any[]): MonthlyReportData {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const filteredTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d >= thirtyDaysAgo;
  });


  const totalSpend = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const hiddenFees = filteredTransactions
    .filter(t => t.category === 'Fees' || t.tags?.includes('hidden-fee'))
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const categoryBreakdown: Record<string, number> = {};
  filteredTransactions.forEach(t => {
    if (t.amount < 0) {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Math.abs(t.amount);
    }
  });

  // Mock limits for CC utilization (since mock-data doesn't have them)
  const ccLimits: Record<string, number> = {
    "HDFC Bank Credit Card": 100000,
    "ICICI Bank Credit Card": 50000,
    "Axis Bank Credit Card": 75000,
    "Simpl BNPL": 10000,
    "LazyPay BNPL": 5000
  };

  const accountBalances: Record<string, number> = {};
  filteredTransactions.forEach(t => {
    accountBalances[t.account] = (accountBalances[t.account] || 0) + Math.abs(t.amount);
  });

  const creditCardUtilization = Object.entries(ccLimits).map(([account, limit]) => {
    const balance = accountBalances[account] || 0;
    return {
      account,
      balance,
      limit,
      utilization: (balance / limit) * 100
    };
  });

  const merchantBreaches = alerts.map(alert => {
    const current = filteredTransactions
      .filter(t => t.description.toLowerCase().includes(alert.merchant.toLowerCase()) || (alert.merchant === "Fuel" && t.category === "Fuel"))
      .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
    
    return {
      merchant: alert.merchant,
      limit: alert.limit,
      current
    };
  }).filter(a => a.current >= a.limit * 0.8);

  return {
    totalSpend,
    totalIncome,
    hiddenFees,
    categoryBreakdown,
    accountUtilization: accountBalances,
    merchantBreaches,
    creditCardUtilization,
    savingsFromDisputes: hiddenFees // For POC, assuming all hidden fees are "wins" if disputed
  };
}
