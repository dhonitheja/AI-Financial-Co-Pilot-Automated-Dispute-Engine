"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, IndianRupee, PieChart as PieChartIcon, BarChart3, Calendar } from "lucide-react";

interface TrendDashboardProps {
  transactions: any[];
}

const TIME_RANGES = [
  { label: "1 Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "1 Year", days: 365 },
  { label: "5 Years", days: 1825 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

export function TrendDashboard({ transactions }: TrendDashboardProps) {
  const [range, setRange] = useState(TIME_RANGES[2]); // Default 6 Months

  const filteredData = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - range.days);
    
    // Apply Sahamati/SEBI cap for investments (2 years)
    const investmentCutoff = new Date();
    investmentCutoff.setDate(investmentCutoff.getDate() - 730);

    return transactions.filter(t => {
      const txDate = new Date(t.date);
      if (t.category === 'Investment' && txDate < investmentCutoff) return false;
      return txDate >= cutoff;
    });
  }, [transactions, range]);

  // Aggregate by Month for Bar Chart
  const barData = useMemo(() => {
    const monthlyGroups: Record<string, { name: string, income: number, expenses: number }> = {};
    
    // Fill in last N months even if empty
    for (let i = 0; i < range.days / 30; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const name = d.toLocaleString('default', { month: 'short' });
        monthlyGroups[key] = { name, income: 0, expenses: 0 };
    }

    filteredData.forEach(t => {
      // Robust date parsing (YYYY-MM-DD)
      const [y, m] = t.date.split('-');
      const key = `${y}-${m}`;
      if (monthlyGroups[key]) {
        if (t.amount > 0) monthlyGroups[key].income += t.amount;
        else monthlyGroups[key].expenses += Math.abs(t.amount);
      }
    });

    return Object.values(monthlyGroups).reverse();

  }, [filteredData, range]);

  // Aggregate by Category for Pie Chart
  const pieData = useMemo(() => {
    const categories: Record<string, number> = {};
    filteredData.forEach(t => {
      if (t.amount < 0) {
        categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
      }
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Current Month vs Last Month for Hero Stat
  const heroStats = useMemo(() => {
    const now = new Date();
    const currM = now.getMonth();
    const currY = now.getFullYear();
    const prevM = currM === 0 ? 11 : currM - 1;
    const prevY = currM === 0 ? currY - 1 : currY;

    const currentStats = transactions.filter(t => {
      const [y, m] = t.date.split('-').map(Number);
      return y === currY && m === (currM + 1);
    });

    const prevStats = transactions.filter(t => {
      const [y, m] = t.date.split('-').map(Number);
      return y === prevY && m === (prevM + 1);
    });

    const currentIn = currentStats.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const currentOut = currentStats.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const currentSavings = currentIn - currentOut;

    const prevIn = prevStats.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const prevOut = prevStats.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const prevSavings = prevIn - prevOut;

    const diff = currentSavings - prevSavings;
    const pct = prevSavings !== 0 ? (diff / Math.abs(prevSavings)) * 100 : 0;

    return { total: currentSavings, pct, trend: diff >= 0 ? 'up' : 'down' };
  }, [transactions]);


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            Trends & Projections
          </h2>
          <p className="text-xs font-bold text-zinc-500 italic">Historical analysis across 12 financial endpoints.</p>
        </div>
        <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl gap-1 self-start">
          {TIME_RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                range.label === r.label 
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gap Chart */}
        <Card className="lg:col-span-2 border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
          <CardHeader>
            <CardTitle className="text-sm font-black italic uppercase tracking-widest text-zinc-400">Income vs Expenses</CardTitle>
            <CardDescription className="text-xs font-bold text-zinc-500 italic">Visualizing the gap between inflow and outflow.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="name" fontSize={10} fontWeight={900} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} fontWeight={900} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 900, marginBottom: '4px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', paddingTop: '20px' }} />
                <Bar dataKey="income" name="Income" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Hero Savings */}
          <Card className="border-zinc-200 bg-indigo-600 text-white shadow-xl shadow-indigo-500/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-xl bg-white/10">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <Badge className="bg-white/20 hover:bg-white/30 border-none text-[10px] font-black italic">Net Surplus</Badge>
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Total Saved This Month</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-3xl font-black italic">₹{heroStats.total.toLocaleString('en-IN')}</h3>
                  <div className={`flex items-center text-[10px] font-black ${heroStats.trend === 'up' ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {heroStats.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(heroStats.pct).toFixed(1)}% vs last month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Pie */}
          <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black italic uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" /> Category Mix
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
