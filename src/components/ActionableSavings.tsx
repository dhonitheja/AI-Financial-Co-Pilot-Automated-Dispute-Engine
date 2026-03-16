
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, TrendingDown, IndianRupee, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DisputeModal } from "./DisputeModal";

interface SavingItem {
  title: string;
  description: string;
  amount: number;
  impact: "High" | "Medium" | "Low";
}

interface ActionableSavingsProps {
  savings: SavingItem[];
}

export function ActionableSavings({ savings }: ActionableSavingsProps) {
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const handleDisputeClick = (item: SavingItem) => {
    // For the demo, we create a pseudo-transaction from the saving item
    setSelectedTx({
      description: item.title,
      amount: item.amount / 12, // Monthly estimate
      date: new Date().toISOString().split('T')[0],
      account: "Flagged Account",
      tags: item.title.includes('Interest') ? ['high-interest'] : ['hidden-fee']
    });
  };

  return (
    <>
      <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2 italic">
            <TrendingDown className="h-5 w-5 text-emerald-500" />
            Actionable Savings Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savings.length === 0 && (
            <p className="text-zinc-500 text-sm py-8 text-center font-medium italic">Run AI Co-Pilot to see savings opportunities.</p>
          )}
          {savings.map((item, index) => (
            <div key={index} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-900 transition-all group relative">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-black text-zinc-900 dark:text-white flex items-center gap-2">
                    {item.title}
                    <Badge variant={item.impact === 'High' ? 'destructive' : 'secondary'} className="text-[10px] px-1.5 py-0 font-bold uppercase">
                      {item.impact} Impact
                    </Badge>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{item.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-black text-lg">
                    <IndianRupee className="h-4 w-4" />
                    {item.amount.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[10px] text-zinc-400 font-bold">est. annual</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-[10px] font-black rounded-full border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1"
                >
                  Solve Now <ArrowDownRight className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-[10px] font-black rounded-full border-red-200 text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-1"
                  onClick={() => handleDisputeClick(item)}
                >
                  <ShieldAlert className="h-3 w-3" />
                  Dispute Charge
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedTx && (
        <DisputeModal 
          transaction={selectedTx} 
          isOpen={!!selectedTx} 
          onClose={() => setSelectedTx(null)} 
        />
      )}
    </>
  );
}
