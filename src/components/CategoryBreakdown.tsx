
"use client"

import { TrendingDown } from "lucide-react"
import { Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "housing", amount: 1800, fill: "var(--color-housing)" },
  { category: "food", amount: 450, fill: "var(--color-food)" },
  { category: "shopping", amount: 320, fill: "var(--color-shopping)" },
  { category: "entertainment", amount: 150, fill: "var(--color-entertainment)" },
  { category: "transport", amount: 120, fill: "var(--color-transport)" },
  { category: "utilities", amount: 200, fill: "var(--color-utilities)" },
]

const chartConfig = {
  amount: {
    label: "Amount ($)",
  },
  housing: {
    label: "Housing",
    color: "hsl(var(--chart-1))",
  },
  food: {
    label: "Food & Drink",
    color: "hsl(var(--chart-2))",
  },
  shopping: {
    label: "Shopping",
    color: "hsl(var(--chart-3))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-4))",
  },
  transport: {
    label: "Transport",
    color: "hsl(var(--chart-5))",
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig

export function CategoryBreakdown() {
  return (
    <Card className="flex flex-col border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>March 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
               {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Spending down by 12% this month <TrendingDown className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total spending for the current billing cycle.
        </div>
      </CardFooter>
    </Card>
  )
}
