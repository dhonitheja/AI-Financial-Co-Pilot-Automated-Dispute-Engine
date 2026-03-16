
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Button } from "@/components/ui/button";
import { Wallet, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const status = localStorage.getItem("finpilot_onboarded");
    setIsOnboarded(status === "true");
  }, []);

  if (status === "loading" || isOnboarded === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not onboarded, show onboarding
  if (!isOnboarded) {
    return <OnboardingFlow onComplete={() => {
      localStorage.setItem("finpilot_onboarded", "true");
      setIsOnboarded(true);
    }} />;
  }

  // Show login landing with manual skip to dashboard for verification
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent)]">
      <div className="w-full max-w-lg text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/20">
          <Wallet className="h-10 w-10 text-white" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white italic tracking-tighter leading-tight">
            Financial Co-Pilot <br /> <span className="text-zinc-500">Secure Access</span>
          </h1>
          <p className="text-zinc-400 text-sm font-medium max-w-sm mx-auto">
            Your DPDP-compliant audit session has expired. Please sign in to resume monitoring your 7 financial accounts.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black italic text-xl shadow-xl shadow-white/5">
              Enter Dashboard (Guest) <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-2 text-zinc-500">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">DPDP 2023 End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
