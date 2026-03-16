
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { DisputeModal } from "./DisputeModal";

interface TransactionTableProps {
  transactions: any[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const isDisputable = (tx: any) => {
    return tx.tags?.includes('hidden-fee') || tx.tags?.includes('high-interest') || tx.category === 'Fees';
  };

  return (
    <>
      <div className="rounded-xl border border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction: any) => (
              <TableRow key={transaction.id} className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                <TableCell className="font-medium text-zinc-500 dark:text-zinc-400">
                  {new Date(transaction.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </TableCell>
                <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100 italic">
                  <div className="flex items-center gap-2">
                    {transaction.description}
                    {isDisputable(transaction) && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setSelectedTransaction(transaction)}
                        title="Dispute Charge"
                      >
                        <ShieldAlert className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-zinc-500 font-medium">
                  {transaction.account || 'Unknown'}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-bold border-zinc-200 dark:border-zinc-800 text-[10px] h-5 uppercase tracking-tighter">
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-black ${transaction.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {isDisputable(transaction) && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-[10px] font-black rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hidden group-hover:flex"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        Dispute
                      </Button>
                    )}
                    <Badge 
                      variant={transaction.status === 'flagged' ? 'destructive' : transaction.status === 'pending' ? 'secondary' : 'default'}
                      className={`capitalize text-[10px] h-5 font-bold ${transaction.status === 'completed' || !transaction.status ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}`}
                    >
                      {transaction.status || 'completed'}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedTransaction && (
        <DisputeModal 
          transaction={selectedTransaction} 
          isOpen={!!selectedTransaction} 
          onClose={() => setSelectedTransaction(null)} 
        />
      )}
    </>
  );
}
