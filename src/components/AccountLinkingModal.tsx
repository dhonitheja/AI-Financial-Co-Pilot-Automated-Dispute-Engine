"use client";

import { useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Upload, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  Globe, 
  Lock,
  Loader2,
  CheckCircle2,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AccountLinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountLinked: (transactions: any[]) => void;
}

export function AccountLinkingModal({ isOpen, onClose, onAccountLinked }: AccountLinkingModalProps) {
  const [mode, setMode] = useState<"AA" | "PDF">("AA");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockFIPs = [
    { name: "American Express Banking Corp", type: "Credit Card", id: "FIP-AMEX-001", aliases: ["Amex"] },
    { name: "HDFC Bank Ltd", type: "Bank", id: "FIP-HDFC-001", aliases: [] },
    { name: "ICICI Bank Ltd", type: "Bank", id: "FIP-ICICI-001", aliases: [] },
    { name: "SBI Cards & Payment Services", type: "Credit Card", id: "FIP-SBICARD-001", aliases: ["SBI Card"] },
    { name: "Discover Bank", type: "Credit Card", id: "FIP-DISC-001", aliases: ["Discover"] }
  ];

  const filteredFIPs = mockFIPs.filter(fip => 
    fip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fip.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  const handleLinkAA = (fipName: string) => {
    setIsLinking(true);
    // Simulate AA Linking Flow
    setTimeout(() => {
      setIsLinking(false);
      onClose();
      // In a real app, this would fetch data from AA
      onAccountLinked([]); 
    }, 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadStatus("uploading");

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const response = await fetch("/api/parse-statement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64, fileName: file.name })
        });
        const data = await response.json();
        if (data.transactions) {
          setUploadStatus("success");
          onAccountLinked(data.transactions);
          setTimeout(() => {
            onClose();
            setUploadStatus("idle");
          }, 1500);
        } else {
          setUploadStatus("error");
        }
      } catch (err) {
        setUploadStatus("error");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden rounded-3xl">
        <div className="p-8 space-y-8">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <Globe className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 border-indigo-100">AA Discovery Node</Badge>
            </div>
            <DialogTitle className="text-3xl font-black italic tracking-tighter">Link Your Capital</DialogTitle>
            <DialogDescription className="text-zinc-500 font-bold italic">
              Connect via Account Aggregator or secure PDF upload for private credit cards.
            </DialogDescription>
          </DialogHeader>

          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl gap-2">
            <button 
              onClick={() => setMode("AA")}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                mode === "AA" 
                ? "bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm shadow-black/5" 
                : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <ShieldCheck className="h-4 w-4" /> Account Aggregator
            </button>
            <button 
              onClick={() => setMode("PDF")}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                mode === "PDF" 
                ? "bg-white dark:bg-zinc-800 text-indigo-600 shadow-sm shadow-black/5" 
                : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <Upload className="h-4 w-4" /> PDF Statement Fallback
            </button>
          </div>

          {mode === "AA" ? (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input 
                  placeholder="Search FIP (e.g. American Express, Discover, Amex)" 
                  className="pl-12 h-14 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredFIPs.length > 0 ? filteredFIPs.map((fip) => (
                  <div 
                    key={fip.id}
                    onClick={() => handleLinkAA(fip.name)}
                    className="group p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black italic">{fip.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{fip.type}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                )) : (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-sm font-bold text-zinc-500 italic">No FIP found for "{searchQuery}"</p>
                    <p className="text-[10px] font-black uppercase text-indigo-600 cursor-pointer hover:underline" onClick={() => setMode("PDF")}>Try PDF Upload Fallback</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-56 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-8 text-center gap-4 ${
                  uploadStatus === "uploading" ? "border-indigo-600 bg-indigo-50/20" :
                  uploadStatus === "success" ? "border-emerald-500 bg-emerald-50/20" :
                  uploadStatus === "error" ? "border-rose-500 bg-rose-50/20" :
                  "border-zinc-200 dark:border-zinc-800 hover:border-indigo-600 bg-zinc-50 dark:bg-zinc-900"
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf"
                  onChange={handleFileUpload}
                />
                
                {uploadStatus === "idle" && (
                  <>
                    <div className="p-4 rounded-full bg-white dark:bg-zinc-800 shadow-xl shadow-black/5">
                      <Upload className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black italic">Drop your Discover/Amex Statement</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">Secure OCR Parsing via Vertex AI Intelligence</p>
                    </div>
                  </>
                )}

                {uploadStatus === "uploading" && (
                  <>
                    <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                    <div className="space-y-1">
                      <p className="text-sm font-black italic">Extracting Transaction Artifacts...</p>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{fileName}</p>
                    </div>
                  </>
                )}

                {uploadStatus === "success" && (
                  <>
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    <p className="text-sm font-black italic">Extraction Complete!</p>
                  </>
                )}

                {uploadStatus === "error" && (
                  <>
                    <X className="h-10 w-10 text-rose-500" />
                    <p className="text-sm font-black italic">Parsing Failed. Try again.</p>
                  </>
                )}
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50">
                <Lock className="h-4 w-4 text-amber-600 mt-1 shrink-0" />
                <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
                  Statements are processed in memory and never stored on our servers. Extraction is done using DPDP-compliant AI models.
                </p>
              </div>
            </div>
          )}

          {isLinking && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
              <h3 className="text-xl font-black italic tracking-tight">Authenticating with AA Discovery</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Waiting for FIP Handshake Confirmation</p>
            </div>
          )}
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3 text-zinc-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">AES-256 Encrypted Discovery</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-[10px] font-black uppercase text-zinc-500 hover:text-zinc-900 transition-none rounded-full">Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
