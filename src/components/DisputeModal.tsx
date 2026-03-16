
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Check, Send } from "lucide-react";

interface DisputeModalProps {
  transaction: any;
  isOpen: boolean;
  onClose: () => void;
}

export function DisputeModal({ transaction, isOpen, onClose }: DisputeModalProps) {
  const [emailContent, setEmailContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction }),
      });
      const data = await response.json();
      setEmailContent(data.email);
    } catch (error) {
      console.error("Failed to generate email", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    if (!emailContent) return;

    let subject = `Dispute: Transaction ₹${Math.abs(transaction.amount)} on ${transaction.date}`;
    let body = emailContent;

    // Try to extract subject if AI provided one
    const lines = emailContent.split("\n");
    const subjectLine = lines.find(line => line.toLowerCase().startsWith("subject:"));
    if (subjectLine) {
      subject = subjectLine.replace(/subject:/i, "").trim();
      // Remove subject line from body to avoid duplication
      body = lines.filter(line => !line.toLowerCase().startsWith("subject:")).join("\n").trim();
    }

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  // Generate email when modal opens if not already generated
  useState(() => {
    if (isOpen && !emailContent) {
      generateEmail();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold italic">Dispute Charge</DialogTitle>
          <DialogDescription>
            We've drafted a professional dispute email for the ₹{Math.abs(transaction.amount)} charge on {transaction.date}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 min-h-[300px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-xs font-bold text-zinc-500 italic">AI is drafting your dispute...</p>
            </div>
          ) : (
            <pre className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
              {emailContent}
            </pre>
          )}
        </div>

        <DialogFooter className="mt-6 flex gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-full text-xs font-bold">
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={copyToClipboard} 
            className="rounded-full text-xs font-bold gap-2"
            disabled={isLoading || !emailContent}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy to Clipboard"}
          </Button>
          <Button 
            className="rounded-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            disabled={isLoading || !emailContent}
            onClick={handleSendEmail}
          >
            <Send className="h-3 w-3" />
            Send via Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
