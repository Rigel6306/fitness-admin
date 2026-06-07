"use client"

import * as React from "react"
import { Pie, PieChart, Cell, LabelList } from "recharts"
import { CardContent } from "@/src/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/src/components/ui/chart"
import { LiquidOverlayVarient1 } from "../liquidOverlay"
import AnimatedContainer from "../animatedContainer"
// Premium color tokens matching your dark, high-contrast ecosystem
const BRAND_PALETTE = [
  "#0affca", // Signature Vibrant Cyan
  "#00bfa5", // Deep Teal Accent
  "#38bdf8", // Sky Blue Accent
  "#1e293b", // Deep Slate Layer
  "#475569", // Medium Muted Slate
]

const chartData = [
  { package: "Workouts Only", visitors: 275 },
  { package: "Treadmill+Workouts", visitors: 200 },
  { package: "Treadmill+Workouts+zumba", visitors: 200 },
  { package: "Zumba Only", visitors: 150 },
  { package: "Zumba+workouts", visitors: 120 },
].map((item, index) => ({
  ...item,
  // Dynamically injecting your premium brand color palette mapping
  fill: BRAND_PALETTE[index % BRAND_PALETTE.length],
}))

const chartConfig = {
  visitors: {
    label: "Members",
  },
} satisfies ChartConfig

export function ChartPieSimple() {
  return (
    <AnimatedContainer className="relative flex flex-col md:flex-row items-center justify-between w-full h-full rounded-2xl bg-black/10 backdrop-blur-2xl p-6 border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Liquid UI Skin Underlay */}
      <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />

      {/* Title & Legend Info Stack */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full md:w-1/2 gap-6 order-2 md:order-1">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-white/90 text-lg font-bold font-sans tracking-wide uppercase">
            Membership Distribution
          </h2>
          <p className="text-white/30 text-[11px] font-mono tracking-wider uppercase">
            Package Tier Demographics
          </p>
        </div>

        {/* Clean Dashboard Key / Legend Component Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-[11px] font-sans font-bold uppercase tracking-wider text-white/60">
              <span 
                className="w-2.5 h-2.5 rounded-md shrink-0 border border-white/10 shadow-sm"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="truncate text-white/80">{entry.package}</span>
              <span className="font-mono text-white/30 ml-auto font-normal">({entry.visitors})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Block Visualizer */}
      <CardContent className="relative z-10 flex-1 w-full md:w-1/2 flex items-center justify-center p-0 order-1 md:order-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[200px] sm:max-w-[220px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent 
                  className="bg-[#0b0b0c]/90 border border-white/10 backdrop-blur-md rounded-xl p-2.5 shadow-xl text-white font-sans text-xs uppercase tracking-wider" 
                  hideLabel 
                />
              }
            />
            <Pie 
              data={chartData} 
              dataKey="visitors" 
              nameKey="package"
              innerRadius={45} // Turned into a donut variant for a more technical layout feel
              outerRadius={80}
              paddingAngle={3} // Added subtle structural segmentation gaps
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  stroke="rgba(0,0,0,0.3)" 
                  strokeWidth={1}
                />
              ))}
              {/* Dynamic contextual monospace percentages layered into major nodes */}
              <LabelList 
                dataKey="visitors" 
                position="inside" 
                className="font-mono text-[10px] font-bold fill-black/60 hidden sm:block"
                formatter={(value: number) => {
                  const total = chartData.reduce((acc, curr) => acc + curr.visitors, 0)
                  return `${Math.round((value / total) * 100)}%`
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </AnimatedContainer>
  )
}