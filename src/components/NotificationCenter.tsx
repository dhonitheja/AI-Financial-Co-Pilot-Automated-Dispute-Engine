"use client";

import { useState, useEffect } from "react";
import { Bell, X, CheckCircle2, AlertTriangle, AlertCircle, Info, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Persona, generateNotificationMessage, NotificationPayload } from "@/lib/notification-logic";
import { toast } from "sonner";

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  type: 'WARNING' | 'CRITICAL';
  merchant: string;
  read: boolean;
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [persona, setPersona] = useState<Persona>('Coach');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load persona from local storage
  useEffect(() => {
    const savedPersona = localStorage.getItem("finpilot_persona") as Persona;
    if (savedPersona) setPersona(savedPersona);
  }, []);

  const handlePersonaChange = (newPersona: Persona) => {
    setPersona(newPersona);
    localStorage.setItem("finpilot_persona", newPersona);
    toast.success(`Persona changed to ${newPersona}`, {
      description: `Intelligence Engine will now use ${newPersona === 'Coach' ? 'encouraging' : newPersona === 'Auditor' ? 'direct' : 'insightful'} tone.`
    });
  };

  const addNotification = (payload: NotificationPayload) => {
    const message = generateNotificationMessage(payload, persona);
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(7),
      message,
      timestamp: new Date(),
      type: payload.level,
      merchant: payload.merchant,
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast
    if (payload.level === 'CRITICAL') {
      toast.error(payload.merchant + " Limit Exceeded!", {
        description: message,
        duration: 5000,
      });
    } else {
      toast.warning(payload.merchant + " Budget Alert", {
        description: message,
        duration: 5000,
      });
    }
  };

  // Expose to window for testing/mocking
  useEffect(() => {
    (window as any).triggerNotification = addNotification;
    (window as any).setPersona = handlePersonaChange;
  }, [persona]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="relative">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full relative border-zinc-200 dark:border-zinc-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-600" />
                <h3 className="font-black italic text-sm tracking-tight">Intelligence Feed</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase text-zinc-400">Persona Profile</span>
                <Badge variant="outline" className="text-[8px] font-black bg-indigo-50 text-indigo-700 border-indigo-100">AI Powered</Badge>
              </div>
              <div className="flex gap-2">
                {(['Coach', 'Auditor', 'Analyst'] as Persona[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePersonaChange(p)}
                    className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                      persona === p 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                        : "bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-20">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                    <Info className="h-6 w-6 text-zinc-400" />
                  </div>
                  <p className="text-xs font-bold text-zinc-500 italic">No intelligence alerts yet.</p>
                  <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-tighter font-black">Monitoring transactions...</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className={`p-3 rounded-xl border transition-all ${
                    n.type === 'CRITICAL' 
                      ? "bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/50" 
                      : "bg-orange-50 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/50"
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1.5">
                        {n.type === 'CRITICAL' ? <AlertCircle className="h-3 w-3 text-red-600" /> : <AlertTriangle className="h-3 w-3 text-orange-600" />}
                        <span className="text-[10px] font-black italic">{n.merchant} Alert</span>
                      </div>
                      <span className="text-[8px] font-bold text-zinc-400">{n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] font-medium leading-relaxed italic text-zinc-800 dark:text-zinc-200">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-zinc-900">
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-400" onClick={() => setNotifications([])}>
                Clear All Audit Trails
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
