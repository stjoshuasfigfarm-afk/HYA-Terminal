
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List, X, TrendingUp, TrendingDown } from "lucide-react";
import type { TickerData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WatchlistPanelProps {
  symbols: string[];
  tickerData: Record<string, TickerData>;
  onTickerSelect: (ticker: string) => void;
  onRemove: (ticker: string) => void;
}

export default function WatchlistPanel({ symbols, tickerData, onTickerSelect, onRemove }: WatchlistPanelProps) {
  return (
    <Card className="glass-panel border-white/10 shrink-0 overflow-hidden flex flex-col h-full bg-black/40 rounded-xl">
      <CardHeader className="py-2 px-3 flex flex-row items-center justify-between space-y-0 shrink-0 border-b border-white/10 bg-white/[0.02]">
        <CardTitle className="text-[10px] font-headline flex items-center gap-2 text-primary uppercase font-black tracking-widest">
          <List className="w-4 h-4" /> Institutional Watchlist
        </CardTitle>
        <span className="text-[8px] font-black text-muted-foreground uppercase">{symbols.length} Nodes</span>
      </CardHeader>
      <CardContent className="p-1 flex-1 overflow-y-auto custom-scrollbar">
        {symbols.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 opacity-40">
            <span className="text-[9px] font-black uppercase text-center">No assets synchronized</span>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {symbols.map(symbol => {
              const data = tickerData[symbol];
              const isPositive = (data?.priceChange ?? 0) >= 0;
              return (
                <div 
                  key={symbol}
                  className="group flex items-center justify-between p-2 hover:bg-white/5 transition-colors rounded border border-transparent hover:border-white/5"
                >
                  <button 
                    onClick={() => onTickerSelect(symbol)}
                    className="flex flex-col items-start flex-1"
                  >
                    <span className="text-[10px] font-black text-primary uppercase">{symbol}</span>
                    <span className="text-[8px] text-muted-foreground uppercase truncate max-w-[120px]">{data?.name || 'Loading...'}</span>
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-white tabular-nums">
                        ${(data?.price ?? 0).toFixed(2)}
                      </span>
                      <div className={cn("flex items-center gap-0.5 text-[8px] font-black", isPositive ? "text-green-400" : "text-red-400")}>
                        {isPositive ? <TrendingUp className="w-2 h-2" /> : <TrendingDown className="w-2 h-2" />}
                        {Math.abs(data?.priceChange ?? 0).toFixed(1)}%
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(symbol);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
