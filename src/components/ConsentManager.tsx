
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, History, XCircle, AlertTriangle } from "lucide-react";

interface AccountConsent {
  id: string;
  bankName: string;
  accountType: string;
  purpose: string;
  expiryDate: string;
}

interface ConsentManagerProps {
  consents: AccountConsent[];
  onRevoke: (id: string) => void;
}

export function ConsentManager({ consents, onRevoke }: ConsentManagerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black italic tracking-tight text-zinc-900 dark:text-white">Consent Manager</h2>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">DPDP 2023 Compliant • Digital Nagarik Rights</p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
          <ShieldCheck className="h-3 w-3 mr-1" /> All Consents Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consents.map((consent) => (
          <Card key={consent.id} className="border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50 hover:shadow-lg transition-all border-l-4 border-l-indigo-600">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-black">{consent.bankName}</CardTitle>
                <Badge variant="secondary" className="text-[10px] font-bold">{consent.accountType}</Badge>
              </div>
              <CardDescription className="text-xs font-medium text-zinc-500">{consent.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-black text-zinc-400 tracking-tighter">Primary Purpose</p>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{consent.purpose}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-2 border-y border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <History className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase">Data Expiry</span>
                </div>
                <span className="text-xs font-black text-red-600 dark:text-red-400">{consent.expiryDate}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 rounded-full text-[10px] font-black h-8">
                  Update Settings
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="flex-1 rounded-full text-[10px] font-black h-8 gap-1"
                  onClick={() => onRevoke(consent.id)}
                >
                  <XCircle className="h-3 w-3" />
                  Revoke Access
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-black text-orange-900 dark:text-orange-400">Right to Forget</p>
          <p className="text-[10px] font-medium text-orange-800/80 dark:text-orange-400/80 leading-relaxed">
            Revoking access will trigger the immediate deletion of all transaction artifacts and derived financial insights 
            from our servers in accordance with the Digital Personal Data Protection Act.
          </p>
        </div>
      </div>
    </div>
  );
}
