
"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, ShieldCheck, LogOut, History, Wallet } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-xs font-black italic text-zinc-500 uppercase tracking-widest">Loading Digital Identity...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 flex items-center justify-center mb-6">
          <ShieldCheck className="h-8 w-8 text-indigo-500" />
        </div>
        <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">Secure Session Required</h1>
        <p className="text-zinc-500 text-sm max-w-xs mb-8">Please sign in to access your financial profile and audit logs.</p>
        <Button className="rounded-full bg-white text-black hover:bg-zinc-200 font-black italic px-8">
          <Link href="/api/auth/signin">Sign In to FinPilot</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-black text-xl text-zinc-900 dark:text-zinc-100 italic">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white not-italic shadow-lg">
                <Wallet className="h-4 w-4" />
              </div>
              FinPilot
            </Link>
          </div>
          <Button 
            variant="ghost" 
            className="rounded-full text-xs font-black text-zinc-500 hover:text-red-500"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Profile Info */}
          <Card className="md:col-span-1 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-4 text-3xl font-black italic text-indigo-600">
                {session.user?.email?.[0].toUpperCase()}
              </div>
              <CardTitle className="text-xl font-black italic">{session.user?.email?.split('@')[0]}</CardTitle>
              <CardDescription className="text-xs font-medium text-indigo-600">Digital Nagarik Verified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <Mail className="h-4 w-4 text-zinc-400" />
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Login Email</p>
                  <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate">{session.user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Status</p>
                  <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">DPDP Authenticated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session & Security */}
          <Card className="md:col-span-2 border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
            <CardHeader>
              <CardTitle className="text-xl font-black italic flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-500" />
                Session History
              </CardTitle>
              <CardDescription className="text-xs font-medium text-zinc-500 italic">Manage your active digital sessions and security logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <SessionItem 
                  device="Current Session - Windows (Chrome)" 
                  ip="192.168.1.1 (Local)" 
                  status="Active" 
                  current 
                />
                <SessionItem 
                  device="iOS App Preview" 
                  ip="103.21.12.45" 
                  status="Timed Out" 
                />
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Button className="w-full rounded-xl bg-zinc-900 dark:bg-white dark:text-black font-black italic text-xs h-10">
                  Revoke All Other Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SessionItem({ device, ip, status, current = false }: { device: string, ip: string, status: string, current?: boolean }) {
  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${current ? 'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${current ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
          <History className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-black italic">{device}</p>
          <p className="text-[10px] font-medium text-zinc-400">{ip}</p>
        </div>
      </div>
      <Badge variant={current ? "default" : "secondary"} className="text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border-emerald-100">
        {status}
      </Badge>
    </div>
  );
}
