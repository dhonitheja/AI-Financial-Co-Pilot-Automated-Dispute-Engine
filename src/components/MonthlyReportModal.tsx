"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Send, FileText, Check } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportMarkdown: string;
  isLoading: boolean;
}

export function MonthlyReportModal({ isOpen, onClose, reportMarkdown, isLoading }: MonthlyReportModalProps) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    // For POC, we'll create a text file download. In a full app, this would be a PDF.
    const element = document.createElement("a");
    const file = new Blob([reportMarkdown], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Monthly_Financial_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            Monthly Wealth Intelligence
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 p-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 report-content">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="font-black italic text-zinc-900 dark:text-zinc-100">Private Wealth AI is auditing your month...</p>
                <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-tighter">Aggregating across 7 accounts</p>
              </div>
            </div>
          ) : (
            <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-black italic tracking-tighter border-b pb-4 mb-6" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-black italic tracking-tight mt-8 mb-4 flex items-center gap-2 text-indigo-600" {...props} />,
                  p: ({node, ...props}) => <p className="text-sm leading-relaxed mb-4 italic font-medium" {...props} />,
                  li: ({node, ...props}) => <li className="text-sm mb-2 italic font-medium list-none flex items-start gap-2 before:content-['→'] before:text-indigo-500 before:font-black" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-black text-indigo-700 dark:text-indigo-400" {...props} />,
                }}
              >
                {reportMarkdown}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <DialogFooter className="mt-8 flex gap-3 print:hidden">
          <Button variant="outline" onClick={onClose} className="rounded-full font-black text-xs uppercase tracking-widest px-8">
            Close
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePrint} 
            className="rounded-full font-black text-xs uppercase tracking-widest px-8 gap-2 border-zinc-200"
            disabled={isLoading}
          >
            Print to PDF
          </Button>
          <Button 
            className="rounded-full font-black text-xs uppercase tracking-widest px-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-500/20"
            disabled={isLoading}
            onClick={handleDownload}
          >
            {downloaded ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {downloaded ? "Saved" : "Download Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
