
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart as PieChartIcon, 
  ShieldAlert, 
  Settings, 
  Wallet,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  Search,
  Bell,
  Sparkles,
  Loader2,
  ShieldCheck,
  Eye,
  LogOut,
  User,
  AlertTriangle,
  History
} from "lucide-react";
import { TransactionTable } from "@/components/TransactionTable";
import { CategoryBreakdown } from "@/components/CategoryBreakdown";
import { ActionableSavings } from "@/components/ActionableSavings";
import { FinancialHealthScore } from "@/components/FinancialHealthScore";
import { TransparencyScore } from "@/components/TransparencyScore";
import { ConsentManager } from "@/components/ConsentManager";
import { AlertEngine, type AlertLimit } from "@/components/AlertEngine";
import { SpendingVelocity } from "@/components/SpendingVelocity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationCenter } from "@/components/NotificationCenter";
import { MonthlyReportModal } from "@/components/MonthlyReportModal";
import { TrendDashboard } from "@/components/TrendDashboard";
import { AccountLinkingModal } from "@/components/AccountLinkingModal";
import { FileText, Calendar } from "lucide-react";
import { ForensicLoading } from "@/components/ForensicLoading";






export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [forensicInsight, setForensicInsight] = useState<string | null>(null);

  
  const [alerts, setAlerts] = useState<AlertLimit[]>([
    { merchant: "Swiggy", limit: 3000, current: 0 },
    { merchant: "Zomato", limit: 2500, current: 0 },
    { merchant: "Zepto", limit: 1000, current: 0 },
    { merchant: "Amazon", limit: 5000, current: 0 },
    { merchant: "Flipkart", limit: 5000, current: 0 },
    { merchant: "Fuel", limit: 4000, current: 0 },
  ]);

  const [velocityData, setVelocityData] = useState<any[]>([]);

  const [consents, setConsents] = useState([
    { id: "CONS-HDFC-9921", bankName: "HDFC Bank", accountType: "Savings", purpose: "Detecting Hidden Fees", expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString() },
    { id: "CONS-ICICI-4412", bankName: "ICICI Bank", accountType: "Credit Card", purpose: "Interest Trap Audit", expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString() },
    { id: "CONS-AXIS-5561", bankName: "Axis Bank", accountType: "Credit Card", purpose: "Fee Transparency Audit", expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString() }
  ]);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);



  const fetchData = async () => {
    try {
      const res = await fetch('/api/mock-data');
      const data = await res.json();
      setTransactions(data);
      calculateCurrentSpends(data);
    } catch (err) {
      console.error("Failed to load mock data", err);
    }
  };

  const calculateCurrentSpends = (txs: any[]) => {
    setAlerts(prev => {
      const updated = prev.map(alert => {
        const current = txs
          .filter(t => t.description.toLowerCase().includes(alert.merchant.toLowerCase()) || (alert.merchant === "Fuel" && t.category === "Fuel"))
          .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
        return { ...alert, current };
      });

      // Sync velocity data for chart (top 5)
      const chartData = updated.slice(0, 5).map(a => ({
        merchant: a.merchant,
        current: a.current,
        limit: a.limit
      }));
      setVelocityData(chartData);
      
      return updated;
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setForensicInsight(null);
    try {
      // 1. Run the standard analysis for the dashboard cards
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, alerts })
      });
      const analyzeData = await analyzeRes.json();
      setAnalysis(analyzeData);

      // 2. Run the deep forensic audit for the loading experience
      // Add an artificial delay to ensure the UX "Scanning" state is visible for at least 7 seconds
      const startTime = Date.now();
      const auditRes = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transactions, 
          merchantLimits: alerts, 
          historicalContext: { last6MoAverage: 14500, last1YrAverage: 14000 } 
        })
      });
      const auditData = await auditRes.json();
      
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 7000;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      setForensicInsight(auditData.forensicInsight);
      
      // If forensic insight is received, move to forensic tab or show it
      setActiveTab("forensic");
    } catch (error) {
      console.error("Analysis/Audit failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };


  const generateMonthlyReport = async () => {
    setReportModalOpen(true);
    setIsGeneratingReport(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, alerts })
      });
      const data = await response.json();
      setReportMarkdown(data.reportMarkdown);
    } catch (error) {
      console.error("Report generation failed", error);
      setReportMarkdown("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleAccountLinked = (newTransactions: any[]) => {
    if (newTransactions && newTransactions.length > 0) {
      setTransactions(prev => [...newTransactions, ...prev]);
      calculateCurrentSpends([...newTransactions, ...transactions]);
    }
  };



  const triggerMockAlert = () => {
    // Inject a mock transaction that puts Zomato spend at 85%
    // Zomato limit is 2500. 85% is 2125.
    const zomatoLimit = alerts.find(a => a.merchant === "Zomato")?.limit || 2500;
    const targetSpend = zomatoLimit * 0.85;
    
    // In a real app, we'd update the DB. Here we update the state and trigger the window event
    const mockTx = {
      id: "mock-" + Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: "Zomato - Dinner Party",
      amount: -targetSpend,
      category: "Food & Dining",
      account: "ICICI Bank"
    };

    setTransactions(prev => [mockTx, ...prev]);
    
    // Calculate new current spends
    const updatedAlerts = alerts.map(a => {
      if (a.merchant === "Zomato") {
        return { ...a, current: targetSpend };
      }
      return a;
    });
    setAlerts(updatedAlerts);

    // Trigger notification via the global function we exposed in NotificationCenter
    if ((window as any).triggerNotification) {
      (window as any).triggerNotification({
        merchant: "Zomato",
        amount: targetSpend,
        limit: zomatoLimit,
        current: targetSpend,
        level: 'WARNING'
      });
    }
  };

  const revokeConsent = (id: string) => {
    setConsents(prev => prev.filter(c => c.id !== id));
    const revokedBank = consents.find(c => c.id === id)?.bankName;
    setTransactions(prev => prev.filter(t => !t.account?.includes(revokedBank)));
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <aside className="w-64 border-r border-zinc-200 bg-white/50 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/50 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl text-zinc-900 dark:text-zinc-100 italic">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white not-italic shadow-lg shadow-indigo-600/20">
              <Wallet className="h-4 w-4" />
            </div>
            FinPilot
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard className="h-4 w-4" />} 
            label="Dashboard" 
            active={activeTab === "dashboard"} 
            onClick={() => setActiveTab("dashboard")} 
          />
          <NavItem 
            icon={<AlertTriangle className="h-4 w-4" />} 
            label="Alert Settings" 
            active={activeTab === "alerts"} 
            onClick={() => setActiveTab("alerts")} 
          />
          <NavItem 
            icon={<ShieldCheck className="h-4 w-4" />} 
            label="Privacy Consents" 
            active={activeTab === "privacy"} 
            onClick={() => setActiveTab("privacy")} 
          />
          <NavItem 
            icon={<FileText className="h-4 w-4" />} 
            label="Monthly Reports" 
            onClick={generateMonthlyReport}
          />
          <NavItem 
            icon={<Bell className="h-4 w-4" />} 
            label="Manage Alerts" 
            onClick={() => window.location.href = "/alerts"}
          />
          <NavItem icon={<History className="h-4 w-4" />} label="Audit Trail" />



        </nav>

        <div className="p-4 mt-auto">
          <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white shadow-lg shadow-indigo-500/20">
            <p className="text-[10px] font-black tracking-widest opacity-80 uppercase italic">AI Auditor</p>
            <p className="text-sm font-black mt-1 leading-tight italic">Scan for Breaches</p>
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-full mt-3 text-xs bg-white text-indigo-600 hover:bg-zinc-100 font-black rounded-full shadow-lg"
              onClick={runAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? <><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Analyzing...</> : <><Sparkles className="mr-2 h-3 w-3" /> Run AI Audit</>}
            </Button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-zinc-200 bg-white/50 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/50 flex items-center justify-between px-8 sticky top-0 z-10 font-sans">
          <div className="flex items-center gap-4 text-[10px] font-black tracking-tight text-zinc-400 uppercase italic">
            <span>FinPilot Secure</span>
            <span className="text-zinc-200 dark:text-zinc-800">/</span>
            <span className="text-zinc-900 dark:text-zinc-100">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="h-7 rounded-full border-indigo-100 bg-indigo-50/50 text-indigo-700 font-bold px-3">
              <ShieldCheck className="h-3 w-3 mr-1.5" /> SECURE-SESSION
            </Badge>
            <NotificationCenter />
            <Link href="/profile">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-[10px] text-white italic hover:bg-indigo-600 transition-colors">
                {session?.user?.email?.[0].toUpperCase() || "JD"}
              </div>
            </Link>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 italic">Financial Dashboard</h1>
                <p className="text-sm font-bold text-zinc-400 italic">Compliance Audit for {session?.user?.email || "Demo Account"}</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={triggerMockAlert} 
                  variant="outline" 
                  className="text-[10px] font-black rounded-full px-6 h-10 border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                >
                  <Sparkles className="mr-2 h-3 w-3" /> Test Alert (Zomato 85%)
                </Button>
                <Button 
                  onClick={generateMonthlyReport} 
                  className="bg-zinc-900 hover:bg-black text-white text-[10px] font-black rounded-full px-6 h-10 italic dark:bg-white dark:text-black gap-2"
                >
                  <Calendar className="h-3 w-3" /> Generate Monthly Report
                </Button>
                <Button variant="outline" className="text-[10px] font-black rounded-full px-6 h-10 border-zinc-200">Export Report</Button>

                <Button 
                  onClick={() => setLinkModalOpen(true)}
                  className="bg-zinc-900 hover:bg-black text-white text-[10px] font-black rounded-full px-6 h-10 italic dark:bg-white dark:text-black"
                >
                  Link Account
                </Button>
              </div>

            </div>

            <TransparencyScore transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <FinancialHealthScore 
                  score={analysis?.healthScore || 0} 
                  level={analysis?.healthLevel || "Audit Required"} 
                />
              </div>
              <div className="lg:col-span-3">
                <ActionableSavings savings={analysis?.actionableSavings || []} />
              </div>
            </div>

            <TrendDashboard transactions={transactions} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <SpendingVelocity data={velocityData} />
              </div>
              <div className="lg:col-span-1">
                 <AlertEngine alerts={alerts} onSave={(newAlerts) => {
                    setAlerts(newAlerts);
                    calculateCurrentSpends(transactions);
                 }} />
              </div>
            </div>


            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 italic">Recent Audit Trail</h2>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase">DPDP Protected</Badge>
              </div>
              <TransactionTable transactions={transactions} />
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <AlertEngine alerts={alerts} onSave={(newAlerts) => setAlerts(newAlerts)} />
             <SpendingVelocity data={velocityData} />
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <ConsentManager consents={consents} onRevoke={revokeConsent} />
          </div>
        )}

        {/* Forensic Audit Tab */}
        {activeTab === "forensic" && (
          <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 italic">Forensic Intelligence Report</h1>
                  <p className="text-sm font-bold text-zinc-400 italic font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" /> PRODUCED BY CLAUDE-3.5-SONNET-V2
                  </p>
                </div>
                <Button 
                  onClick={() => setActiveTab("dashboard")} 
                  variant="outline" 
                  className="rounded-full font-black italic text-xs border-zinc-800"
                >
                  Return to Dashboard
                </Button>
             </div>

             <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative border-t-indigo-600 border-t-4">
                <CardContent className="p-10 prose prose-zinc dark:prose-invert max-w-none font-sans italic">
                   {/* We might need a markdown renderer or just display the text properly */}
                   <div className="whitespace-pre-wrap leading-relaxed text-zinc-300">
                      {forensicInsight}
                   </div>
                </CardContent>
             </Card>

             <div className="flex justify-center gap-4">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black italic rounded-full h-12 px-10 shadow-xl shadow-indigo-600/20 translate-y-0 active:translate-y-1 transition-all">
                   Dispute All Detected Leaks
                </Button>
                <Button variant="outline" className="border-zinc-800 dark:bg-zinc-950 font-black italic rounded-full h-12 px-10">
                   Generate PDF Summary
                </Button>
             </div>
          </div>
        )}

        {isAnalyzing && <ForensicLoading />}

        <MonthlyReportModal 
          isOpen={reportModalOpen} 
          onClose={() => setReportModalOpen(false)} 
          isLoading={isGeneratingReport}
          reportMarkdown={reportMarkdown}
        />

        <AccountLinkingModal 
          isOpen={linkModalOpen}
          onClose={() => setLinkModalOpen(false)}
          onAccountLinked={handleAccountLinked}
        />
      </main>


    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer italic tracking-tight ${
        active 
          ? "bg-white text-indigo-700 shadow-xl shadow-indigo-600/5 border border-zinc-100 dark:bg-zinc-900 dark:text-indigo-400 dark:border-zinc-800" 
          : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:bg-zinc-900"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}
