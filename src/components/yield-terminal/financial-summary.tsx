
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";
import type { TickerData } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { Button } from "../ui/button";

interface FinancialSummaryProps {
  ticker: TickerData;
}

const formatCurrency = (val?: number) => {
  if (val === undefined || val === 0) return "---";
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
  return `$${val.toLocaleString()}`;
};

const revenueConfig = {
  value: { label: "Revenue", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const earningsConfig = {
  eps: { label: "EPS", color: "hsl(var(--accent))" },
} satisfies ChartConfig;

const SEGMENT_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function FinancialSummary({ ticker }: FinancialSummaryProps) {
  const [view, setView] = useState<'revenue' | 'earnings'>('earnings');

  const hasRevenueData = !!(ticker.revenueSegments && ticker.revenueSegments.length > 0);
  const hasEarningsData = !!(ticker.earningsHistory && ticker.earningsHistory.length > 0);

  // Auto-pivot view if selected data track is missing for the new ticker
  useEffect(() => {
    if (view === 'earnings' && !hasEarningsData && hasRevenueData) {
      setView('revenue');
    } else if (view === 'revenue' && !hasRevenueData && hasEarningsData) {
      setView('earnings');
    }
  }, [ticker.symbol, hasEarningsData, hasRevenueData, view]);

  return (
    <Card className="bg-black/40 border-primary/20 shrink-0 overflow-hidden flex flex-col h-full shadow-2xl">
      <CardHeader className="py-2 px-3 flex flex-row items-center justify-between space-y-0 shrink-0 border-b border-white/5 bg-white/[0.02]">
        <CardTitle className="text-[10px] font-headline flex items-center gap-2 text-primary uppercase tracking-widest font-black">
          {view === 'revenue' ? <BarChart3 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
          {view === 'revenue' ? "Revenue Analysis" : "Earnings History"}
        </CardTitle>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-6 w-6 transition-colors", 
              view === 'revenue' ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-white"
            )}
            onClick={() => setView('revenue')}
            disabled={!hasRevenueData}
            title="Switch to Revenue Analysis"
          >
            <BarChart3 className="w-3.5 h-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-6 w-6 transition-colors", 
              view === 'earnings' ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-white"
            )}
            onClick={() => setView('earnings')}
            disabled={!hasEarningsData}
            title="Switch to Earnings History"
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-3 pb-3 flex-1 flex flex-col gap-3 overflow-hidden pt-3 bg-[#050505]">
        {view === 'revenue' && hasRevenueData && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-[140px] bg-white/[0.01] rounded border border-white/5 p-2">
              <ChartContainer config={revenueConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ticker.revenueSegments} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="label" fontSize={8} tick={{ fill: "#888" }} axisLine={false} tickLine={false} hide />
                    <YAxis fontSize={8} tick={{ fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${(val / 1e9).toFixed(0)}B`} />
                    <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-black/95 border border-white/10 p-2 rounded text-[9px] font-mono shadow-2xl backdrop-blur-md">
                              <p className="text-primary font-black uppercase mb-1">{data.label}</p>
                              <p className="text-white font-bold">{formatCurrency(data.value)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {ticker.revenueSegments?.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}

        {view === 'earnings' && hasEarningsData && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-[140px] bg-white/[0.01] rounded border border-white/5 p-2">
              <ChartContainer config={earningsConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ticker.earningsHistory} margin={{ left: -30, right: 10, top: 10, bottom: 0 }}>
                    <XAxis dataKey="quarter" fontSize={8} tick={{ fill: "#888" }} axisLine={false} tickLine={false} />
                    <YAxis fontSize={8} tick={{ fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-black/95 border border-white/10 p-2 rounded text-[9px] font-mono shadow-2xl backdrop-blur-md">
                              <p className="text-primary font-black uppercase mb-1">{data.quarter} EPS</p>
                              <p className="text-white font-bold">${data.eps.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="eps" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]}>
                       {ticker.earningsHistory?.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === ticker.earningsHistory!.length - 1 ? "hsl(var(--primary))" : "hsl(var(--accent))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        )}

        {((view === 'revenue' && !hasRevenueData) || (view === 'earnings' && !hasEarningsData)) && (
          <div className="flex-1 flex items-center justify-center p-4">
             <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest text-center opacity-40">
               No {view} data available for this node.
             </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
