"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Boxes, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const commodityData = [
  { symbol: "LITHIUM", price: 13.450, change: -1.2, unit: "kg" },
  { symbol: "SILICON", price: 2.18, change: 0.8, unit: "lb" },
  { symbol: "WTI_CRUDE", price: 74.32, change: 2.4, unit: "bbl" },
];

export default function CommodityStream() {
  return (
    <Card className="bg-black/40 border-primary/20 shrink-0 overflow-hidden flex flex-col h-full">
      <CardHeader className="py-2 px-3 flex flex-row items-center justify-between space-y-0 shrink-0">
        <CardTitle className="text-[10px] font-headline flex items-center gap-2 text-primary uppercase">
          <Boxes className="w-4 h-4" /> Correlated Commodities
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
        {commodityData.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between p-2 bg-white/[0.03] border border-white/5 rounded-md">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-muted-foreground uppercase">{item.symbol}</span>
              <span className="text-[10px] font-bold text-foreground">
                ${item.price.toLocaleString()} <span className="text-[8px] text-muted-foreground">/{item.unit}</span>
              </span>
            </div>
            <div className={cn("flex items-center gap-1 text-[9px] font-bold", item.change >= 0 ? "text-green-400" : "text-red-400")}>
              {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(item.change)}%
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
