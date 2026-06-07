"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { CardHeader, CardTitle, CardContent } from "@/src/components/ui/card"
import AnimatedContainer from "../animatedContainer"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/src/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import { LiquidOverlayVarient1 } from "../liquidOverlay"

// Keeping the full mock dataset intact inside your file
const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", text: 448, desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Revenue",
    color: "#51A2FF",
  },
  mobile: {
    label: "Members",
    color: "#0affca", // Synchronized with your signature high-contrast Cyan
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <AnimatedContainer className="relative w-full h-full rounded-2xl bg-black/10 backdrop-blur-2xl p-4 sm:p-6 border border-t-white/10 border-x-white/5 border-b-white/0 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Liquid UI Skin Underlay */}
      <LiquidOverlayVarient1 className="backdrop-blur-none pointer-events-none" />

      {/* Decorative localized subtle lighting glow */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-[#0affca]/[0.02] blur-3xl pointer-events-none rounded-full" />

      <CardHeader className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between space-y-0 p-0 pb-6 border-b border-white/5">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-white/90 text-lg font-bold font-sans tracking-wide uppercase">
            Revenue & Member Growth
          </CardTitle>
          <p className="text-white/30 text-[11px] font-mono tracking-wider uppercase">
            Interactive Analytical Streams
          </p>
        </div>

        {/* Re-enabled and restyled custom select dropdown */}
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-full sm:w-[150px] bg-white/[0.03] border border-white/15 text-white/80 rounded-xl px-3 py-2 text-xs font-semibold tracking-wide uppercase shadow-inner transition-colors hover:bg-white/[0.06] focus:ring-1 focus:ring-[#0affca]/30"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="bg-[#121214]/95 border border-white/10 backdrop-blur-xl rounded-xl p-1 text-white shadow-2xl">
            <SelectItem value="90d" className="rounded-lg text-xs font-semibold uppercase tracking-wider text-white/70 focus:bg-white/5 focus:text-[#0affca] cursor-pointer">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg text-xs font-semibold uppercase tracking-wider text-white/70 focus:bg-white/5 focus:text-[#0affca] cursor-pointer">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg text-xs font-semibold uppercase tracking-wider text-white/70 focus:bg-white/5 focus:text-[#0affca] cursor-pointer">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="relative z-10 p-0 pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[240px] w-full text-xs"
        >
          <AreaChart data={filteredData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
            <defs>
              {/* Refined gradient interpolation mappings */}
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.0}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.0}
                />
              </linearGradient>
            </defs>

            {/* Muted grid layout borders */}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={48}
              stroke="rgba(255,255,255,0.3)"
              className="font-mono text-[10px] uppercase font-bold"
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />

            <ChartTooltip
              cursor={{ stroke: "rgba(255, 255, 255, 0.08)", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  className="bg-[#0b0b0c]/90 border border-white/10 backdrop-blur-md rounded-xl p-2.5 shadow-xl text-white font-sans text-xs"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    }).toUpperCase()
                  }}
                  indicator="dot"
                />
              }
            />

            {/* Area Tracks - Unstacked raw curves look cleaner for comparisons */}
            <Area
              dataKey="mobile"
              type="monotone"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              activeDot={{ r: 4, strokeWidth: 0, fill: "var(--color-mobile)" }}
            />
            <Area
              dataKey="desktop"
              type="monotone"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              activeDot={{ r: 4, strokeWidth: 0, fill: "var(--color-desktop)" }}
            />
            
            <ChartLegend 
              className="mt-4 border-t border-white/5 pt-4 text-[11px] font-sans font-bold tracking-wider uppercase text-white/50" 
              content={<ChartLegendContent />} 
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </AnimatedContainer>
  )
}