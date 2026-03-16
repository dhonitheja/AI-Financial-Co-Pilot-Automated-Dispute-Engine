
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowUpRight } from "lucide-react";
import { HiddenFee } from "@/lib/data";

interface HiddenFeesCardProps {
  fees: HiddenFee[];
}

export function HiddenFeesCard({ fees }: HiddenFeesCardProps) {
  const totalHidden = fees.reduce((acc, fee) => acc + fee.amount, 0);

  return (
    <Card className="h-full border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Hidden Fees Detected
          </CardTitle>
          <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400">
            {fees.length} flagged
          </Badge>
        </div>
        <CardDescription>Our AI co-pilot detected potential overcharges.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fees.map((fee) => (
            <div key={fee.id} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex items-start justify-between group cursor-pointer hover:border-orange-200 dark:hover:border-orange-800 transition-all">
              <div className="space-y-1">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  {fee.name}
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">{fee.description}</p>
                <Badge variant="secondary" className="text-[10px] py-0 h-4 capitalize">{fee.frequency}</Badge>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-600 dark:text-orange-400">
                  -${fee.amount.toFixed(2)}
                </p>
                <p className="text-[10px] text-zinc-400">detected {new Date(fee.detectedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Potential Annual Savings</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">$324.40</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
