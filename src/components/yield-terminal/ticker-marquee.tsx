"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

const mockMarqueeData = [
  { symbol: "US30Y", price: 4.52, change: 0.2, isRate: true },
  { symbol: "US20Y", price: 4.41, change: -0.1, isRate: true },
  { symbol: "US10Y", price: 4.28, change: 0.5, isRate: true },
  { symbol: "V", price: 295.45, change: 0.8 },
  { symbol: "MA", price: 492.10, change: 0.9 },
  { symbol: "NVDA", price: 192.01, change: 3.5 },
  { symbol: "MSFT", price: 412.30, change: 0.8 },
  { symbol: "PLTR", price: 65.42, change: 2.1 },
  { symbol: "BTC", price: 98450.21, change: 2.4 },
  { symbol: "IBIT", price: 52.40, change: 2.5 },
];

export default function TickerMarquee() {
  const items = [...mockMarqueeData, ...mockMarqueeData, ...mockMarqueeData];

  return (
    <div className="w-full bg-black/95 border-b border-primary/30 overflow-hidden h-10 flex items-center z-40 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-8 py-1.5">
        {items.map((item, idx) => (
          <div 
            key={`${item.symbol}-${idx}`} 
            className="flex items-center gap-4 font-mono text-[12px] font-black group cursor-default transition-transform hover:scale-105"
          >
            <div className="flex flex-col">
              <span className="text-primary uppercase tracking-tighter leading-none">{item.symbol}</span>
              <span className="text-[7px] text-muted-foreground/50 uppercase font-black tracking-widest mt-0.5">SYST_NODE</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-foreground leading-none tabular-nums font-bold">
                {item.isRate ? `${item.price.toFixed(2)}%` : `${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </span>
              <div className={cn("flex items-center text-[9px] mt-0.5 font-black", item.change >= 0 ? "text-green-400" : "text-red-400")}>
                {item.change >= 0 ? <ChevronUp className="w-2.5 h-2.5 mr-0.5" /> : <ChevronDown className="w-2.5 h-2.5 mr-0.5" />}
                {Math.abs(item.change).toFixed(1)}%
              </div>
            </div>
            <div className="w-[1px] h-5 bg-white/10 ml-6 group-last:hidden" />
          </div>
        ))}
      </div>
    </div>
  );
}
