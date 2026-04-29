
"use client";

import React from "react";
import type { TickerData } from "@/lib/types";
import { cn } from "@/lib/utils";
import ForgeFarmRelay from "./forge-farm-relay";
import { Database, TrendingUp, DollarSign, Star, ShieldCheck, BarChart3, BrainCircuit, PieChart, Activity } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis, AreaChart, Area, CartesianGrid, Tooltip } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface FinancialMetricsProps {
  ticker: TickerData;
  liveData: { price: number; delta: number; volume?: number };
  onToggleWatchlist?: (symbol: string) => void;
  isWatched?: boolean;
}

const formatValue = (num?: number) => {
  if (num === undefined || num === null) return "---";
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${num.toLocaleString()}`;
};

const chartConfig = {
  value: { label: "Value", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const SEGMENT_COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function FinancialMetrics({ ticker, liveData, onToggleWatchlist, isWatched }: FinancialMetricsProps) {
  if (!ticker) return null;
  const price = liveData.price || ticker.price || 0;
  const delta = liveData.delta || ticker.priceChange || 0;
  const isPositive = delta >= 0;

  const assetData = [
    { label: "Cash", value: ticker.cashReserves || 0 },
    { label: "Receivables", value: ticker.receivables || 0 },
    { label: "Inventory", value: ticker.inventory || 0 },
    { label: "Fixed Assets", value: ticker.fixedAssets || 0 },
  ];

  const liquidityTrendData = [
    { date: "Q1 24", value: (ticker.cashReserves || 0) * 0.8 },
    { date: "Q2 24", value: (ticker.cashReserves || 0) * 0.9 },
    { date: "Q3 24", value: (ticker.cashReserves || 0) * 0.85 },
    { date: "Q4 24", value: ticker.cashReserves || 0 },
  ];

  const revenueData = ticker.revenueSegments || [
    { label: "Core Operations", value: 100000000 },
    { label: "Services", value: 80000000 },
    { label: "Licensing", value: 60000000 },
  ];

  const MetricItem = ({ label, value, icon: Icon }: { label: string, value: string | number, icon?: any }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight truncate">{label}</span>
      </div>
      <span className="text-[11px] font-bold text-white tabular-nums ml-2">{value}</span>
    </div>
  );

  return (
    <div className="glass-panel p-4 flex flex-col gap-4 h-full relative rounded-xl bg-black/40 border-white/10 shadow-2xl overflow-visible">
      {/* HEADER: RESPONSIVE PRICE & IDENTITY */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-4 shrink-0 px-1 relative z-10">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-base md:text-lg font-black text-white uppercase tracking-tight truncate max-w-full">{ticker.name}</h2>
              {ticker.isSynthesized && (
                  <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-primary/20 border border-primary/30 rounded text-[8px] text-primary font-black uppercase tracking-widest shrink-0">
                      <BrainCircuit className="w-2.5 h-2.5" />
                      Synthetic Node
                  </div>
              )}
              <button 
                onClick={() => onToggleWatchlist?.(ticker.symbol)}
                className={cn(
                  "p-1 rounded transition-colors shrink-0",
                  isWatched ? "text-primary" : "text-muted-foreground hover:text-white"
                )}
              >
                <Star className={cn("w-4.5 h-4.5", isWatched && "fill-current")} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1 min-w-0">
              <span className="text-[10px] font-black bg-primary text-black px-1.5 py-0.5 rounded-sm shrink-0">{ticker.symbol}</span>
              <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest truncate">{ticker.sector}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white tracking-tighter tabular-nums">${(price ?? 0).toFixed(2)}</span>
            <span className={cn("text-xs font-black px-1.5 py-0.5 rounded", isPositive ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10")}>
              {isPositive ? '▲' : '▼'} {Math.abs(delta ?? 0).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* TOP ROW: PROFILE | CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
          <div className="bg-black/60 border border-white/10 p-4 rounded-xl flex flex-col gap-1 h-full overflow-hidden shadow-inner">
            <span className="text-[10px] text-primary font-black uppercase flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
              <Database className="w-4 h-4" /> Financial Profile
            </span>
            <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                <MetricItem label="Market Cap" value={formatValue(ticker.marketCap)} icon={DollarSign} />
                <MetricItem label="P/E Ratio" value={ticker.peRatio || '---'} icon={TrendingUp} />
                <MetricItem label="Cash Reserves" value={formatValue(ticker.cashReserves)} />
                <MetricItem label="Total Debt" value={formatValue(ticker.totalDebt)} />
                <MetricItem label="Gross Margin" value={ticker.grossMargin ? (ticker.grossMargin * 100).toFixed(1) + '%' : '---'} />
                <MetricItem label="ROE" value={ticker.roe ? (ticker.roe * 100).toFixed(1) + '%' : '---'} />
                <MetricItem label="Beta" value={ticker.beta || '---'} />
                <MetricItem label="RSI" value={ticker.rsi || '---'} />
            </div>
          </div>

          <div className="flex flex-col overflow-hidden relative bg-black/80 border border-white/10 rounded-xl min-h-[420px] shadow-2xl">
            <ForgeFarmRelay ticker={ticker.symbol} />
          </div>
        </div>

        {/* BOTTOM ROW: ASSET | LIQUIDITY | REVENUE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ASSET DISTRIBUTION */}
          <div className="bg-black/80 border border-white/10 p-4 rounded-xl flex flex-col gap-1 overflow-hidden shadow-lg h-[300px]">
            <span className="text-[9px] text-secondary font-black uppercase flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4" /> Asset Distribution
            </span>
            <div className="flex-1 min-h-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetData} layout="vertical" margin={{ top: 10, right: 30, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                    <XAxis 
                      type="number" 
                      fontSize={8} 
                      tick={{ fill: '#888' }} 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(val) => `$${(val / 1e9).toFixed(1)}B`} 
                      label={{ value: 'USD Amount', position: 'bottom', offset: 0, fontSize: 8, fill: '#666' }} 
                    />
                    <YAxis dataKey="label" type="category" fontSize={8} width={70} tick={{ fill: '#bbb', fontWeight: 'bold' }} axisLine={false} tickLine={false}/>
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} />
                    <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]}>
                      {assetData.map((_, idx) => <Cell key={`cell-a-${idx}`} fill={SEGMENT_COLORS[idx % SEGMENT_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* LIQUIDITY INDEX */}
          <div className="bg-black/90 border border-primary/20 p-4 rounded-xl flex flex-col gap-1 overflow-hidden relative shadow-lg h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50 pointer-events-none" />
            <span className="text-[9px] text-primary font-black uppercase flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4" /> Liquidity Index Trend
            </span>
            <div className="flex-1 min-h-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={liquidityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorLiquidity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      fontSize={8} 
                      tick={{ fill: '#888' }} 
                      axisLine={false} 
                      tickLine={false} 
                      label={{ value: 'Last 4 Quarters', position: 'bottom', offset: 0, fontSize: 8, fill: '#666' }} 
                    />
                    <YAxis fontSize={8} axisLine={false} tickLine={false} stroke="#555" tick={{ fill: '#888' }} tickFormatter={(val) => `$${(val / 1e9).toFixed(1)}B`} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLiquidity)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* REVENUE ANALYSIS */}
          <div className="bg-black/80 border border-white/10 p-4 rounded-xl flex flex-col gap-1 overflow-hidden shadow-lg h-[300px]">
            <span className="text-[9px] text-accent font-black uppercase flex items-center gap-2 mb-2">
              <PieChart className="w-4 h-4" /> Revenue Analysis
            </span>
            <div className="flex-1 min-h-0">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      fontSize={8} 
                      tick={{ fill: '#bbb', fontWeight: 'bold' }} 
                      axisLine={false} 
                      tickLine={false} 
                      label={{ value: 'Revenue Segment', position: 'bottom', offset: 0, fontSize: 8, fill: '#666' }}
                    />
                    <YAxis fontSize={8} axisLine={false} tickLine={false} stroke="#555" tick={{ fill: '#888' }} tickFormatter={(val) => `$${(val / 1e6).toFixed(0)}M`} label={{ value: 'Revenue (M)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 8, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} />
                    <Bar dataKey="value" barSize={18} radius={[4, 4, 0, 0]}>
                       {revenueData.map((_, idx) => <Cell key={`cell-r-${idx}`} fill={SEGMENT_COLORS[(idx + 2) % SEGMENT_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
