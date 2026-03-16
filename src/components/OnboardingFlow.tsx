
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Lock, 
  UserCheck, 
  ArrowRight, 
  Info,
  Clock,
  EyeOff
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent)]">
      <div className="w-full max-w-lg space-y-8">
        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-indigo-600' : 'bg-zinc-800'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <Badge text="Regulation DPDP 2023" />
              <h1 className="text-4xl font-black text-white italic tracking-tighter">Plain Language Privacy Notice</h1>
              <p className="text-zinc-400 text-sm font-medium">Clear. Simple. Transparent.</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
              <CardContent className="p-6 space-y-6">
                <NoticeItem 
                  icon={<UserCheck className="h-4 w-4 text-indigo-400" />}
                  title="What we collect"
                  description="We access your last 90 days of transactions from 3 bank accounts and 4 credit cards."
                />
                <NoticeItem 
                  icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
                  title="Why we use it"
                  description="Our 'Actionable Savings' engine scans for 36% APR interest traps and hidden fees to save you up to ₹15,000/year."
                />
                <NoticeItem 
                  icon={<Lock className="h-4 w-4 text-orange-400" />}
                  title="Your Controls"
                  description="You have the 'Right to Forget'. Revoke access anytime in your dashboard to delete all data."
                />
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => setStep(2)}
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-black italic text-lg shadow-xl shadow-white/5"
              >
                I Accept & Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-loose">
                By clicking accept, you authorize FinPilot to fetch mock banking artifacts for financial audit.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
              <Badge text="Security Audit" />
              <h1 className="text-4xl font-black text-white italic tracking-tighter">Consent Tokenization</h1>
              <p className="text-zinc-400 text-sm font-medium">Verifying your digital identity.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <ConsentCheck label="Access Bank Transactions" active />
              <ConsentCheck label="Monitor BNPL Convenience Fees" active />
              <ConsentCheck label="Analyze High-Interest Debt Cycles" active />
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 flex gap-4">
              <Clock className="h-5 w-5 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                This consent is valid for 90 days. It will expire automatically on <span className="text-white font-bold">{new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>.
              </p>
            </div>

            <Button 
              onClick={() => setStep(3)}
              className="w-full h-12 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black italic text-lg shadow-xl shadow-indigo-600/20"
            >
              Verify Digital Consent <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500 text-center">
            <div className="p-4 rounded-full bg-emerald-500/10 w-20 h-20 flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
              <ShieldCheck className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white italic tracking-tighter">Ready to Audit</h1>
              <p className="text-zinc-400 text-sm font-medium">Your DPDP-compliant consent is secured.</p>
            </div>
            
            <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
              We are now fetching transactions from your linked accounts to build your Financial Health Dashboard.
            </p>

            <Button 
              onClick={onComplete}
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-black italic text-lg mt-8"
            >
              Enter Dashboard <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function NoticeItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex gap-4">
      <div className="p-2 h-fit bg-zinc-800 rounded-lg">{icon}</div>
      <div className="space-y-1">
        <h4 className="text-xs font-black uppercase text-zinc-200">{title}</h4>
        <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-black uppercase text-zinc-400 border border-zinc-700 tracking-widest">
      {text}
    </span>
  );
}

function ConsentCheck({ label, active }: { label: string, active: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
      <span className="text-sm font-bold text-zinc-200">{label}</span>
      <div className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}`} />
    </div>
  );
}
