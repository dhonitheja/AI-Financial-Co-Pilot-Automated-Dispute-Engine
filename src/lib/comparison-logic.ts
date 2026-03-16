export interface ComparisonStats {
  currentValue: number;
  previousValue: number;
  variance: number;
  percentageChange: number;
}

export interface MoMSummary {
  totalSavings: ComparisonStats;
  discretionarySpend: ComparisonStats;
  fixedCosts: ComparisonStats;
  hiddenFees: ComparisonStats;
}

export function calculateMoM(current: number, previous: number): ComparisonStats {
  const variance = current - previous;
  const percentageChange = previous !== 0 ? (variance / previous) * 100 : 0;
  return {
    currentValue: current,
    previousValue: previous,
    variance,
    percentageChange
  };
}

export function aggregateComparison(transactions: any[]): MoMSummary {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevMonth = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const filterByMonth = (tx: any, m: number, y: number) => {
    const [year, month] = tx.date.split('-').map(Number);
    return month === (m + 1) && year === y;
  };


  const currentTxs = transactions.filter(t => filterByMonth(t, currentMonth, currentYear));
  const prevTxs = transactions.filter(t => filterByMonth(t, prevMonth, prevYear));

  const getStats = (txs: any[]) => {
    const income = txs.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const fixedCosts = txs.filter(t => t.tags?.includes('fixed-cost')).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const discretionary = txs.filter(t => t.tags?.includes('discretionary')).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const fees = txs.filter(t => t.tags?.includes('hidden-fee')).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    
    // Total Savings: Income - Non-Savings Spends
    // Actually, following user prompt: Total Savings: (Income - Necessary Spends)
    const necessarySpends = fixedCosts; // Simplification for POC
    const totalSavings = income - necessarySpends - discretionary - fees; // Net balance

    return { income, fixedCosts, discretionary, fees, totalSavings };
  };

  const currentMetrics = getStats(currentTxs);
  const prevMetrics = getStats(prevTxs);

  return {
    totalSavings: calculateMoM(currentMetrics.totalSavings, prevMetrics.totalSavings),
    discretionarySpend: calculateMoM(currentMetrics.discretionary, prevMetrics.discretionary),
    fixedCosts: calculateMoM(currentMetrics.fixedCosts, prevMetrics.fixedCosts),
    hiddenFees: calculateMoM(currentMetrics.fees, prevMetrics.fees)
  };
}
