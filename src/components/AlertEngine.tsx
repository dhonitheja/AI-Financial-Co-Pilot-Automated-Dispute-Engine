
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, IndianRupee, Save, Trash2, TrendingUp, AlertCircle } from "lucide-react";

export interface AlertLimit {
  merchant: string;
  limit: number;
  current: number;
}

interface AlertEngineProps {
  alerts: AlertLimit[];
  onSave: (alerts: AlertLimit[]) => void;
}

export function AlertEngine({ alerts, onSave }: AlertEngineProps) {
  const [localAlerts, setLocalAlerts] = useState<AlertLimit[]>(alerts);

  const handleLimitChange = (merchant: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalAlerts(prev => prev.map(a => a.merchant === merchant ? { ...a, limit: numValue } : a));
  };

  const saveAlerts = () => {
    onSave(localAlerts);
  };

  return (
    <Card className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black italic flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-500" />
              Smart Budget Alerts
            </CardTitle>
            <CardDescription className="text-xs font-medium text-zinc-500 mt-1 italic">
              Set monthly velocity limits for high-frequency merchants.
            </CardDescription>
          </div>
          <Button onClick={saveAlerts} size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] gap-2">
            <Save className="h-3 w-3" /> Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localAlerts.map((alert) => (
            <div key={alert.merchant} className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 group transition-all hover:border-indigo-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-[10px] italic">
                    {alert.merchant[0]}
                  </div>
                  <div>
                    <h3 className="text-xs font-black italic">{alert.merchant}</h3>
                    <p className="text-[10px] font-bold text-zinc-400">Monthly Target</p>
                  </div>
                </div>
                {alert.current >= alert.limit && alert.limit > 0 ? (
                  <Badge variant="destructive" className="text-[8px] font-black uppercase py-0 px-1.5 animate-pulse">
                    Critical Alert: Exceeded
                  </Badge>
                ) : alert.current >= alert.limit * 0.8 && alert.limit > 0 ? (
                  <Badge variant="secondary" className="text-[8px] font-black uppercase py-0 px-1.5 bg-orange-100 text-orange-700 border-orange-200">
                    Warning: 80% Reached
                  </Badge>
                ) : (new Date().getDate() <= 7 && alert.current >= alert.limit * 0.5 && alert.limit > 0) ? (
                  <Badge variant="secondary" className="text-[8px] font-black uppercase py-0 px-1.5 bg-amber-100 text-amber-700 border-amber-200">
                    Caution: 50% First Week
                  </Badge>
                ) : null}

              </div>
              
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <IndianRupee className="h-3 w-3" />
                  </span>
                  <Input 
                    type="number" 
                    value={alert.limit} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLimitChange(alert.merchant, e.target.value)}
                    className="pl-8 h-9 text-xs font-black rounded-lg border-zinc-200 focus:ring-indigo-500"
                    placeholder="Set Limit"
                  />
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Current Spend</p>
                  <p className={`text-sm font-black italic ${alert.current > alert.limit && alert.limit > 0 ? 'text-red-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
                    ₹{alert.current.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {alert.limit > 0 && (
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[8px] font-black text-zinc-400 uppercase tracking-tighter">
                    <span>Utilization</span>
                    <span>{Math.round((alert.current / alert.limit) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${alert.current > alert.limit ? 'bg-red-500' : alert.current > alert.limit * 0.8 ? 'bg-orange-400' : 'bg-indigo-500'}`}
                      style={{ width: `${Math.min(100, (alert.current / alert.limit) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 flex gap-3">
          <AlertCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-black text-indigo-900 dark:text-indigo-400 italic">Smart Detection Active</p>
            <p className="text-[10px] font-medium text-indigo-800/80 dark:text-indigo-400/80 leading-relaxed italic">
              Claude 3.5 Sonnet is monitoring incoming transactions. If any velocity limit is breached, we will automatically 
              generate a 'Warning Insight' and draft a budget optimization plan.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
