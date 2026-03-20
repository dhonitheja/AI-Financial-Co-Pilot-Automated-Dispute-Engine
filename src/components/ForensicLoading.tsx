
"use client";

import { useState, useEffect } from "react";
import { Wallet, Sparkles, ShieldCheck, Search, Database, History, TrendingUp, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TIPS = [
  {
    icon: <Database className="h-4 w-4" />,
    text: 'Did you know? Credit cards often charge 3.5% for cash withdrawals. We\'re checking for those "hidden" fees now.'
  },
  {
    icon: <History className="h-4 w-4" />,
    text: 'Quick-commerce habit? Our 5-year scan identifies if your Zepto/Swiggy spending is trending up or down.'
  },
  {
    icon: <Lock className="h-4 w-4" />,
    text: 'Security First: Your data stays in our private Google Cloud perimeter. We never train public models on your bank statements.'
  },
  {
    icon: <TrendingUp className="h-4 w-4" />,
    text: 'Almost there! We are comparing your current month to your 5-year average to find your "Lifestyle Creep" score.'
  }
];

export function ForensicLoading() {
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % TIPS.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) return prev;
        return prev + Math.random() * 2;
      });
    }, 200);

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 px-6 font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.15),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 pointer-events-none" />
      
      <div className="w-full max-w-lg space-y-12 relative animate-in fade-in zoom-in-95 duration-700">
        
        {/* Core Analysis Card */}
        <div className="space-y-8 text-center">
            {/* Logo with Pulse */}
            <div className="flex justify-center">
                <div className="relative group">
                    <div className="absolute inset-0 rounded-3xl bg-indigo-500/30 blur-2xl group-hover:bg-indigo-500/50 transition-all duration-1000 animate-pulse" />
                    <div className="relative w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500 animate-pulse">
                        <Wallet className="h-12 w-12" />
                    </div>
                    <div className="absolute -top-3 -right-3">
                        <Badge variant="outline" className="bg-zinc-950 border-emerald-500/50 text-emerald-500 text-[10px] font-black italic tracking-widest px-3 py-1 animate-bounce">
                           E2E-ACTIVE
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="text-3xl font-black text-white italic tracking-tighter">Forensic Engine Active</h2>
                <div className="flex items-center justify-center gap-3 text-zinc-500 font-bold italic uppercase tracking-[0.2em] text-[10px]">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-indigo-500" /> AES-256</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span className="flex items-center gap-1.5"><Search className="h-3 w-3 text-indigo-500" /> AA-FRAMEWORK</span>
                </div>
            </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-zinc-400 uppercase italic tracking-widest">Scanning 5 Years of Transactions...</span>
                <span className="text-[10px] font-black text-indigo-400 italic tracking-tighter">{Math.floor(progress)}% Complete</span>
            </div>
            <div className="h-3 w-full bg-zinc-900 rounded-full border border-zinc-800 overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-[length:200%_100%] animate-[shimmer_2s_infinite_linear] rounded-full transition-all duration-500 ease-out shadow-lg shadow-indigo-500/20"
                  style={{ width: `${progress}%` }}
                />
            </div>
        </div>

        {/* Audit Tips Carousel */}
        <div className="relative h-24">
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 p-6 flex items-center justify-center overflow-hidden">
                <div key={currentTip} className="flex items-center gap-4 animate-in slide-in-from-bottom-2 fade-in duration-500 text-center max-w-sm">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                        {TIPS[currentTip].icon}
                    </div>
                    <p className="text-xs font-medium text-zinc-300 italic leading-relaxed tracking-tight">
                        {TIPS[currentTip].text}
                    </p>
                </div>
            </div>
            
            {/* Indicators */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center gap-1.5">
                {TIPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all duration-500 ${i === currentTip ? "w-4 bg-indigo-500" : "w-1 bg-zinc-800"}`}
                    />
                ))}
            </div>
        </div>

        <p className="text-center text-[8px] text-zinc-700 font-bold uppercase tracking-[0.3em] mt-12">
            FinPilot Intelligence Layer &copy; 2026 // Secure-Handshake Active
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
