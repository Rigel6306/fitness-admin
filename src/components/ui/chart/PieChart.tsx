"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import AnimatedContainer from "../animatedContainer"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/src/components/ui/chart"

export const description = "A simple pie chart"

const chartData = [
  { package: "Workouts Only", visitors: 275, fill: "#020618  " },
  { package: "Treadmill+Workouts", visitors: 200, fill: "#364153  " },
  { package: "Treadmill+Workouts+zumba", visitors: 200, fill: "#71717B  " },
   { package: "Zumba Only", visitors: 200, fill: "#D4D4D4  " },
    { package: "Zumba+workouts", visitors: 200, fill: "#FAFAF9  " },

]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  package: {
    label: "Workouts Only",
    color: "#673AB7",
  },
 
} satisfies ChartConfig

export function ChartPieSimple() {
  return (
    <div className="flex h-full rounded-xl flex-col bg-black/10 backdrop-blur-md overflow-hidden shadow-md shadow-white/5 ">
      <h1 className="m-2 mx-10 text-lg text-[#F0F0F0] font-sans flex-shrink-0">Membership Distribution</h1>
      <CardContent className="flex-1 pb-0 min-h-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full max-h[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors" nameKey="package" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    
    </div>
  )
}
