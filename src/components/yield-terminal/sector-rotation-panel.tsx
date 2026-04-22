
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { TickerData } from '@/lib/types';

const sectorPerformance = [
  { name: 'AI Infra', change: 4.2, normalized: 92 },
  { name: 'Semis', change: 3.1, normalized: 85 },
  { name: 'Tech', change: 2.5, normalized: 78 },
  { name: 'Finance', change: 1.2, normalized: 65 },
  { name: 'Healthcare', change: -0.5, normalized: 45 },
  { name: 'Industrials', change: -1.4, normalized: 35 },
  { name: 'Energy', change: -1.8, normalized: 30 },
  { name: 'Consumer', change: -3.0, normalized: 20 },
];

const cycleInfo = [
    {
        title: "Early Recovery",
        description: "Growth begins to expand. Interest rates are low. Bullish for high-beta sectors.",
        sectors: ["Technology", "Semis", "AI Infra"]
    },
    {
        title: "Full Recovery",
        description: "Growth peaks. Inflation pressures build. Leadership shifts to commodities and industrials.",
        sectors: ["Energy", "Materials", "Industrials"]
    },
    {
        title: "Early Recession",
        description: "Growth slows. Confidence wanes. Defensive positioning becomes paramount.",
        sectors: ["Healthcare", "Cons Staples", "Real Estate"]
    },
    {
        title: "Full Recession",
        description: "Defensive positioning dominates. Rates are cut. Yield curve typically un-inverting from extremes.",
        sectors: ["Utilities", "Healthcare", "Cons Staples"]
    }
];

const chartConfig = {
  normalized: {
    label: 'Momentum Score',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface SectorRotationPanelProps {
  onTickerSelect: (ticker: string) => void;
  tickerData: Record<string, TickerData>;
}

export default function SectorRotationPanel({ onTickerSelect, tickerData }: SectorRotationPanelProps) {
  return (
    <Card className="bg-black/40 border-border flex-1 flex flex-col min-h-0 overflow-hidden h-full rounded-xl shadow-2xl">
      <CardHeader className="pb-2 px-4 py-3 shrink-0 border-b border-white/5 bg-white/[0.02]">
        <CardTitle className="flex items-center gap-2 text-[10px] font-headline uppercase text-primary font-black tracking-widest">
          <Target className="w-4 h-4" />
          Structural Sector Radar (Kiviat)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-start pt-4 px-4 pb-4 flex-1 overflow-y-auto custom-scrollbar">
        
        <div className="w-full bg-primary/5 border border-primary/20 p-2.5 rounded-lg flex items-start gap-2 mb-2">
            <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <p className="text-[8px] text-muted-foreground leading-tight uppercase font-black">
                Kiviat Mapping: Visualizing institutional rotation velocity. The central area identifies "Drought" zones, while edges represent "High-Yield" momentum.
            </p>
        </div>

        <div className="w-full h-[280px] min-h-[280px] bg-black/20 rounded-xl border border-white/5 relative">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={sectorPerformance} cx="50%" cy="50%" outerRadius="80%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis 
                  dataKey="name" 
                  tick={{ fill: "#888", fontSize: 8, fontWeight: 'black' }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={false} 
                  axisLine={false} 
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Radar
                  name="Sector Momentum"
                  dataKey="normalized"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="absolute top-2 right-2 text-[7px] font-black text-muted-foreground/40 uppercase">V_4.0_Radar</div>
        </div>

        <div className="w-full mt-2">
          <Accordion type="single" collapsible className="w-full">
            {cycleInfo.map((cycle, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-white/5">
                <AccordionTrigger className="text-[9px] font-black py-2.5 uppercase tracking-widest hover:text-primary transition-colors">
                  {cycle.title}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-muted-foreground text-[9px] italic mb-3 leading-relaxed border-l-2 border-primary/20 pl-2">{cycle.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cycle.sectors.map(sector => (
                      <div key={sector} className="bg-primary/10 text-primary border border-primary/20 text-[7px] px-2 py-0.5 rounded uppercase font-black tracking-tighter">
                        {sector}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
