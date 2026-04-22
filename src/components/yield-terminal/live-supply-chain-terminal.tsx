
"use client";

import React from "react";
import type { TickerData, SupplyChainNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { 
  Truck, 
  Factory, 
  Users, 
  ExternalLink, 
  ChevronDown, 
  Zap, 
  Clock, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck,
  ShieldAlert,
  Info
} from "lucide-react";

interface LiveSupplyChainTerminalProps {
  activeTicker: string;
  tickerData: Record<string, TickerData>;
  onTickerSelect: (ticker: string) => void;
  livePrices: Record<string, { price: number; delta: number; } | null>;
}

const NodeCard = ({
  node,
  onTickerSelect,
  isActive,
  variant = "neutral"
}: {
  node: Partial<SupplyChainNode> & { symbol?: string };
  onTickerSelect: (ticker: string) => void;
  isActive?: boolean;
  variant?: "upstream" | "downstream" | "midstream" | "neutral";
}) => {
  const symbol = node.name || node.symbol || "";
  const status = node.status || 'Active';
  
  const variantStyles = {
    upstream: "border-red-500/40 bg-red-500/5 hover:bg-red-500/10",
    downstream: "border-green-500/40 bg-green-500/5 hover:bg-green-500/10",
    midstream: "border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10",
    neutral: "border-white/10 bg-white/5 hover:bg-white/[0.08]"
  };

  const statusGlows = {
    Active: "shadow-[0_0_10px_rgba(38,166,154,0.3)]",
    Bottlenecked: "shadow-[0_0_20px_rgba(239,83,80,0.6)] border-red-500 animate-pulse",
    Delayed: "shadow-[0_0_12px_rgba(251,191,36,0.4)] border-amber-500",
    IDLE: "opacity-60"
  };

  const variantAccent = {
    upstream: "text-red-400",
    downstream: "text-green-400",
    midstream: "text-blue-400",
    neutral: "text-primary"
  };

  const formatThroughput = (val?: number) => {
    if (!val) return "N/A";
    if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
    return val.toLocaleString();
  };

  return (
    <div 
      className={cn(
        "relative flex flex-col p-2.5 border transition-all duration-300 w-full group z-20 rounded-lg shrink-0",
        isActive 
          ? "bg-primary border-primary shadow-[0_0_25px_rgba(38,166,154,0.5)] ring-2 ring-primary/20 scale-105" 
          : cn(variantStyles[variant], statusGlows[status]),
      )}
    >
      <div className="flex justify-between items-start mb-1.5">
        <button 
          onClick={() => onTickerSelect(symbol)}
          className={cn(
            "font-black text-[11px] hover:opacity-80 uppercase tracking-tight flex items-center gap-1.5",
            isActive ? "text-black" : variantAccent[variant]
          )}
        >
          {symbol}
          {!isActive && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </button>
        {status === 'Active' && !isActive && (
            <div className="bg-green-500/20 rounded-full p-0.5 animate-spin-slow">
                <Activity className="w-2.5 h-2.5 text-green-400" />
            </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p className={cn("text-[9px] font-black truncate uppercase tracking-[0.15em]", isActive ? "text-black/90" : "text-white/95")}>{node.type || 'Institutional Entity'}</p>
        
        <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-1.5">
                <Zap className={cn("w-3 h-3", isActive ? "text-black/60" : "text-primary/60")} />
                <span className={cn("text-[9px] font-bold", isActive ? "text-black/80" : "text-muted-foreground")}>{formatThroughput(node.throughput)}</span>
            </div>
            {node.transitLinks && node.transitLinks.length > 0 && (
                <div className="flex items-center gap-1.5">
                    <Clock className={cn("w-3 h-3", isActive ? "text-black/60" : "text-muted-foreground/60")} />
                    <span className={cn("text-[9px] font-bold", isActive ? "text-black/80" : "text-muted-foreground")}>{node.transitLinks[0].leadTimeDays}D</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default function LiveSupplyChainTerminal({
  activeTicker,
  tickerData,
  onTickerSelect
}: LiveSupplyChainTerminalProps) {
  const currentTicker = tickerData[activeTicker];

  if (!currentTicker) return null;

  const suppliers = currentTicker.suppliers || [];
  const midstream = currentTicker.midstream || [];
  const customers = currentTicker.customers || [];

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col rounded-xl border border-white/5 shadow-2xl">
      {/* STATUS LEGEND HEADER */}
      <div className="z-30 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-3 flex flex-wrap items-center gap-x-8 gap-y-2 shrink-0">
        <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Standard Flow</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Critical Bottleneck (Transactional Stagnation)</span>
        </div>
        <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/80">Logistics Latency</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-muted-foreground/40" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Real-time Topology Verification Active</span>
        </div>
      </div>

      {/* RELATIONSHIP CONTEXT BANNER */}
      <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-2 flex items-center gap-3 shrink-0">
        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
        <p className="text-[9px] text-red-300 font-bold uppercase tracking-wider leading-tight">
          System Intelligence: Blinking nodes indicate Transactional Stagnation. Structural links are active but value transmission has ceased.
        </p>
      </div>

      <div className="relative flex-1 p-6 overflow-hidden">
        {/* FLOWING LINES BACKGROUND */}
        <svg className="absolute inset-0 pointer-events-none z-10 w-full h-full opacity-10">
            <path d="M 0 100 Q 400 80 800 100" stroke="hsl(var(--primary))" fill="none" className="animate-flow-line" strokeWidth="2" />
            <path d="M 0 300 Q 400 320 800 300" stroke="hsl(var(--primary))" fill="none" className="animate-flow-line" strokeWidth="2" />
            <circle cx="50%" cy="50%" r="42%" stroke="hsl(var(--secondary))" fill="none" strokeDasharray="12 12" className="animate-spin-slow" />
        </svg>

        <div className="flex-1 grid grid-cols-3 gap-8 z-20 overflow-hidden relative h-full">
            
            {/* COLUMN 1: SUPPLIERS */}
            <div className="flex flex-col overflow-hidden relative h-full">
            <div className="flex items-center gap-2 mb-6 shrink-0 bg-black/80 backdrop-blur-xl px-4 py-2 border border-white/10 w-fit rounded-lg shadow-xl">
                <Truck className="w-5 h-5 text-red-400" />
                <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white">Suppliers</span>
            </div>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-3 pb-12">
                {suppliers.map(s => (
                <NodeCard 
                    key={s.name} 
                    node={s} 
                    onTickerSelect={onTickerSelect} 
                    variant="upstream"
                />
                ))}
            </div>
            </div>

            {/* COLUMN 2: LOGISTICS NODES */}
            <div className="flex flex-col items-center justify-start gap-12 relative overflow-hidden h-full border-x border-white/5 px-6">
            <div className="relative group shrink-0 w-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full border border-primary/30 shadow-inner">
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.5em] animate-pulse">Session Focus</span>
                    </div>
                    <NodeCard 
                        node={{ symbol: activeTicker, type: currentTicker.sector, summary: currentTicker.description, status: 'Active' }} 
                        onTickerSelect={onTickerSelect} 
                        isActive
                    />
                    <ChevronDown className="w-8 h-8 text-primary/40 animate-bounce" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-6 w-full flex-1 overflow-hidden">
                <div className="flex items-center gap-2 bg-black/80 backdrop-blur-xl px-6 py-2 border border-secondary/40 w-fit rounded-lg shadow-xl">
                <Factory className="w-5 h-5 text-secondary" />
                <span className="text-[11px] font-black text-secondary tracking-[0.3em] uppercase">Logistics Nodes</span>
                </div>
                
                <div className="flex-1 flex flex-col gap-3 w-full overflow-y-auto custom-scrollbar pb-12">
                {midstream.map(m => (
                    <NodeCard 
                    key={m.name} 
                    node={m} 
                    onTickerSelect={onTickerSelect} 
                    variant="midstream"
                    />
                ))}
                </div>
            </div>
            </div>

            {/* COLUMN 3: CUSTOMERS */}
            <div className="flex flex-col items-end overflow-hidden relative h-full">
            <div className="flex items-center gap-2 mb-6 shrink-0 bg-black/80 backdrop-blur-xl px-4 py-2 border border-white/10 w-fit rounded-lg shadow-xl">
                <Users className="w-5 h-5 text-green-400" />
                <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white">Customers</span>
            </div>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pl-3 pb-12 w-full">
                {customers.map(c => (
                <NodeCard 
                    key={c.name} 
                    node={c} 
                    onTickerSelect={onTickerSelect} 
                    variant="downstream"
                />
                ))}
            </div>
            </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 flex items-center gap-6 z-30 pointer-events-none">
          <div className="text-[10px] text-muted-foreground/60 font-black uppercase flex items-center gap-3 bg-black/50 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
              Network_Velocity_Relay
          </div>
      </div>
    </div>
  );
}
