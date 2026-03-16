
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Bell, 
  SettingIcon, 
  ShieldCheck, 
  IndianRupee, 
  Trash2, 
  TrendingUp, 
  AlertCircle,
  Clock,
  LayoutDashboard
} from "lucide-react";
import { AlertEngine, type AlertLimit } from "@/components/AlertEngine";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NotificationCenter } from "@/components/NotificationCenter";

export default function AlertsPage() {
  const { data: session } = useSession();
  const [alerts, setAlerts] = useState<AlertLimit[]>([
    { merchant: "Swiggy", limit: 3000, current: 2400 },
    { merchant: "Zomato", limit: 2500, current: 1500 },
    { merchant: "Zepto", limit: 1000, current: 1100 },
    { merchant: "Amazon", limit: 5000, current: 3500 },
    { merchant: "Flipkart", limit: 5000, current: 2000 },
    { merchant: "Fuel", limit: 4000, current: 1200 },
  ]);

  // In a real app, we'd fetch this from the DB
  useEffect(() => {
    const saved = localStorage.getItem("user_alerts");
    if (saved) {
      setAlerts(JSON.parse(saved));
    }
  }, []);

  const handleSave = (newAlerts: AlertLimit[]) => {
    setAlerts(newAlerts);
    localStorage.setItem("user_alerts", JSON.stringify(newAlerts));
    // In a real app, this would be a PATCH request to the API
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <aside className="w-64 border-r border-zinc-200 bg-white/50 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/50 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl text-zinc-900 dark:text-zinc-100 italic">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white not-italic shadow-lg shadow-indigo-600/20">
              <TrendingUp className="h-4 w-4" />
            </div>
            FinPilot
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer italic tracking-tight text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer italic tracking-tight bg-white text-indigo-700 shadow-xl shadow-indigo-600/5 border border-zinc-100 dark:bg-zinc-900 dark:text-indigo-400 dark:border-zinc-800">
            <Bell className="h-4 w-4" />
            Manage Alerts
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-zinc-200 bg-white/50 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/50 flex items-center justify-between px-8 sticky top-0 z-10 font-sans">
          <div className="flex items-center gap-4 text-[10px] font-black tracking-tight text-zinc-400 uppercase italic">
            <span>FinPilot Secure</span>
            <span className="text-zinc-200 dark:text-zinc-800">/</span>
            <span className="text-zinc-900 dark:text-zinc-100">Manage Alerts</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="h-7 rounded-full border-indigo-100 bg-indigo-50/50 text-indigo-700 font-bold px-3">
              <ShieldCheck className="h-3 w-3 mr-1.5" /> SECURE-SESSION
            </Badge>
            <NotificationCenter />
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 italic">Merchant Guardrails</h1>
              <p className="text-sm font-bold text-zinc-400 italic">Configure real-time velocity monitoring for high-frequency merchants.</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="rounded-full text-[10px] font-black uppercase h-10 px-6 gap-2 border-zinc-200">
                <ArrowLeft className="h-3 w-3" /> Back to Space
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <AlertEngine alerts={alerts} onSave={handleSave} />
            
            <Card className="border-zinc-200 bg-zinc-900 text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Clock className="h-32 w-32" />
               </div>
               <CardHeader className="relative z-10">
                  <Badge className="w-fit mb-2 bg-indigo-600 font-black italic">PRO FEATURE</Badge>
                  <CardTitle className="text-2xl font-black italic">Advanced Velocity Monitoring</CardTitle>
                  <CardDescription className="text-zinc-400 font-medium italic">
                    FinPilot AI doesn't just watch your limit; it watches your speed.
                  </CardDescription>
               </CardHeader>
               <CardContent className="relative z-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <VelocityFeature 
                        title="Early Warning"
                        desc="Get notified if you've used 50% of your budget in the first 7 days."
                     />
                     <VelocityFeature 
                        title="Weekend Surge"
                        desc="Get insights on high lifestyle spend during Saturdays and Sundays."
                     />
                     <VelocityFeature 
                        title="Projected Breach"
                        desc="AI predicts when you will hit 100% based on current spending rate."
                     />
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex gap-3 text-indigo-300">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-[10px] font-bold leading-relaxed italic">
                      Velocity tracking reduces accidental overspending by 24% on average for our users. Set tight guardrails to maximize your Month-on-Month savings.
                    </p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function VelocityFeature({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="space-y-2">
       <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 italic">{title}</h4>
       <p className="text-[11px] font-medium text-zinc-500 leading-relaxed italic">{desc}</p>
    </div>
  )
}
