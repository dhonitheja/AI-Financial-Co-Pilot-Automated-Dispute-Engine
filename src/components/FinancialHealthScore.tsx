
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface FinancialHealthScoreProps {
  score: number;
  level: string;
}

export function FinancialHealthScore({ score, level }: FinancialHealthScoreProps) {
  // Determine color based on score
  const getColor = () => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500";
    if (score >= 50) return "text-orange-500 stroke-orange-500";
    return "text-red-500 stroke-red-500";
  };

  const getBackground = () => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className="h-full border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-500" />
          Financial Health
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-4">
        <div className="relative h-32 w-32">
          {/* Circular Progress Bar */}
          <svg className="h-full w-full" viewBox="0 0 36 36">
            <path
              className="stroke-zinc-100 dark:stroke-zinc-800"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`${getColor()} transition-all duration-1000 ease-out`}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-zinc-900 dark:text-white">{score}</span>
            <span className="text-[10px] uppercase font-bold text-zinc-400">Score</span>
          </div>
        </div>
        
        <div className={`mt-6 px-4 py-1 rounded-full text-white text-xs font-bold ${getBackground()}`}>
          {level}
        </div>
        
        <p className="mt-4 text-xs text-center text-zinc-500 dark:text-zinc-400 max-w-[200px]">
          Your health score is based on debt management and fee exposure.
        </p>
      </CardContent>
    </Card>
  );
}
