
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, ShieldX, Percent } from "lucide-react";

interface TransparencyScoreProps {
  transactions: any[];
}

export function TransparencyScore({ transactions }: TransparencyScoreProps) {
  const totalSpend = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);
    
  const totalHiddenFees = transactions
    .filter(t => t.category === 'Fees' || t.tags?.includes('hidden-fee'))
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  // Transparency Score: Inverse of Fee/Spend ratio
  // If 0 spend, score is 100.
  const feeRatio = totalSpend > 0 ? (totalHiddenFees / totalSpend) : 0;
  const score = Math.max(0, Math.min(100, Math.round((1 - (feeRatio * 5)) * 100)));

  return (
    <Card className="border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Main Score */}
          <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest">Transparency Score</p>
            <div className="relative h-20 w-20 flex items-center justify-center">
               <svg className="absolute inset-0 h-full w-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-zinc-100 dark:text-zinc-800" />
                <circle cx="18" cy="18" r="16" fill="transparent" stroke="currentColor" strokeWidth="3" strokeDasharray={`${score}, 100`} strokeLinecap="round" className="text-indigo-600 transition-all duration-1000" />
              </svg>
              <span className="text-2xl font-black italic">{score}</span>
            </div>
            <p className="mt-3 text-[10px] font-bold text-zinc-500 italic">Portfolio Health</p>
          </div>

          {/* Stats Breakdown */}
          <div className="p-6 flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <ShieldX className="h-4 w-4 text-red-600" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-tight text-zinc-900 dark:text-white">Fee Exposure</h4>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-black text-zinc-900 dark:text-white">₹{totalHiddenFees.toLocaleString('en-IN')}</p>
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-[10px] py-0 bg-red-50 text-red-700 dark:bg-red-900/30">High Drain</Badge>
                  <p className="text-[10px] font-bold text-zinc-400">from {transactions.filter(t => t.category === 'Fees').length} hidden events</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <Percent className="h-4 w-4 text-emerald-600" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-tight text-zinc-900 dark:text-white">Leak Ratio</h4>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-black text-zinc-900 dark:text-white">{(feeRatio * 100).toFixed(1)}%</p>
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-[10px] py-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30">Industry Avg: 2.1%</Badge>
                  <p className="text-[10px] font-bold text-zinc-400">leakage per transaction</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Call */}
          <div className="p-6 md:w-1/4 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col justify-center items-center text-center">
            <Eye className="h-6 w-6 text-zinc-400 mb-2" />
            <p className="text-xs font-black text-zinc-700 dark:text-zinc-300">Action Required</p>
            <p className="text-[10px] font-medium text-zinc-500 mt-1">Dispute {transactions.filter(t => t.tags?.includes('hidden-fee')).length} flagged charges to improve score.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
