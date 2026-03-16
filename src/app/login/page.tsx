
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, ArrowRight, Loader2, Sparkles, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid financial identifier (email).");
      return;
    }

    setIsLoading(true);
    
    // Simulate Magic Link flow
    try {
      const result = await signIn("magic-link", {
        email,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        setError("Encryption handshake failed. Please check your credentials.");
      } else {
        // Mock successful magic link "sent" and then auto-redirect for POC
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError("Terminal error during authentication.");
    } finally {
      // Keep loading for the redirect
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.15),transparent)]">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/20 rotate-3">
            <Lock className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white italic tracking-tighter">Secure Handshake</h1>
            <p className="text-zinc-500 text-sm font-bold italic uppercase tracking-widest">Bank-Grade Infrastructure</p>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden relative border-t-indigo-500/50">
          <div className="absolute top-0 right-0 p-4">
             <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 text-[8px] font-black uppercase bg-emerald-500/5">
                AES-256 Active
             </Badge>
          </div>
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-white text-xl font-black italic">Financial Co-Pilot</CardTitle>
            <CardDescription className="text-zinc-500 font-medium italic">Enter your email to receive a secure access key.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  <Input 
                    type="email"
                    placeholder="name@wealth.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-700 h-12 pl-10 rounded-xl focus:ring-indigo-600 transition-all ${error ? 'border-rose-500/50 focus:ring-rose-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {error && <p className="text-rose-500 text-[10px] font-black italic uppercase tracking-tighter animate-in fade-in slide-in-from-top-1">{error}</p>}
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 rounded-xl font-black italic text-lg shadow-xl shadow-white/5 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                ) : (
                  <>Send Magic Link <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
                )}
              </Button>
              <div className="text-center">
                <button 
                  type="button"
                  className="text-[10px] font-black text-zinc-500 hover:text-indigo-400 uppercase tracking-widest transition-colors"
                  onClick={() => alert("Security handshake initiated. Identity verification link sent to your registered FIP contact.")}
                >
                  Forgot Access Key?
                </button>
              </div>
            </form>


            <div className="flex items-center gap-4 text-zinc-700">
               <div className="h-px flex-1 bg-zinc-800"></div>
               <span className="text-[10px] uppercase font-black tracking-widest">or secure-vault</span>
               <div className="h-px flex-1 bg-zinc-800"></div>
            </div>

            <Button 
              variant="outline" 
              className="w-full h-12 border-zinc-800 bg-transparent text-zinc-400 font-black italic text-sm rounded-xl hover:bg-zinc-800 hover:text-white"
              disabled={isLoading}
            >
              Sign in with Security Key
            </Button>
          </CardContent>
          <CardFooter className="bg-zinc-950/50 p-6 flex items-center gap-4 border-t border-zinc-800">
             <Shield className="h-5 w-5 text-indigo-500 opacity-50 shrink-0" />
             <p className="text-[10px] text-zinc-600 font-bold leading-relaxed italic">
                By signing in, you agree to our DPDP-compliant data governance policy. Your identifiers are end-to-end encrypted.
             </p>
          </CardFooter>
        </Card>

        <p className="text-center text-[10px] text-zinc-600 font-black uppercase tracking-widest">
           FinPilot Intelligence Layer &copy; 2026
        </p>
      </div>
    </div>
  );
}
