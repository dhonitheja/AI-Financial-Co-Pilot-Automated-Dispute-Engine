
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import { TrendingUp } from "lucide-react";

interface SpendingVelocityProps {
  data: {
    merchant: string;
    current: number;
    limit: number;
  }[];
}

export function SpendingVelocity({ data }: SpendingVelocityProps) {
  return (
    <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black italic flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
              Spending Velocity
            </CardTitle>
            <CardDescription className="text-xs font-medium text-zinc-500 mt-1 italic">
              Current Spend vs Alert Limit for top merchants.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="merchant" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontSize: '10px',
                  fontWeight: 900
                }} 
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              />
              <Bar 
                dataKey="limit" 
                name="Monthly Limit" 
                fill="#e4e4e7" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
              <Bar 
                dataKey="current" 
                name="Current Spend" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.current >= entry.limit ? '#ef4444' : entry.current >= entry.limit * 0.8 ? '#f97316' : '#6366f1'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
