
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldAlert, ExternalLink, Database, Search } from "lucide-react";
import type { TickerData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface RegistryPanelProps {
  tickerData: Record<string, TickerData>;
  onTickerSelect: (ticker: string) => void;
}

export default function RegistryPanel({ tickerData, onTickerSelect }: RegistryPanelProps) {
  const tickers = Object.values(tickerData);
  const [filter, setFilter] = React.useState("");

  const filteredTickers = tickers.filter(t => 
    t.symbol.toLowerCase().includes(filter.toLowerCase()) || 
    (t.name && t.name.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <Card className="glass-panel h-full flex flex-col overflow-hidden rounded-xl">
      <CardHeader className="py-3 px-6 flex flex-row items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex flex-col">
            <CardTitle className="text-lg flex items-center gap-2 text-primary uppercase font-black tracking-tighter">
            <ShieldAlert className="w-5 h-5" />
            Asset Registry Index
            </CardTitle>
            <p className="text-[10px] text-muted-foreground uppercase font-black">Institutional node manifest</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search Nodes..." 
                    className="pl-9 bg-black/40 border-white/10"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <Database className="w-3 h-3 text-primary" />
            {tickers.length} NODES_ACTIVE
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto custom-scrollbar">
        <Table>
          <TableHeader className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase text-white py-4 px-6">Ticker</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white">Entity Name</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white">Sector</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white text-right">Price</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white text-right">Delta</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white text-center">Pivot</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickers.map((ticker) => (
              <TableRow key={ticker.symbol} className="border-white/5 hover:bg-primary/10 transition-all group cursor-default">
                <TableCell className="font-black text-primary py-4 px-6">{ticker.symbol}</TableCell>
                <TableCell className="text-white font-medium max-w-[200px] truncate uppercase text-[10px]">{ticker.name}</TableCell>
                <TableCell className="text-muted-foreground text-[9px] uppercase font-black">{ticker.sector}</TableCell>
                <TableCell className="text-right text-white font-black tabular-nums">${(ticker.price ?? 0).toFixed(2)}</TableCell>
                <TableCell className={cn("text-right font-black tabular-nums", (ticker.priceChange ?? 0) >= 0 ? "text-green-400" : "text-red-400")}>
                  {(ticker.priceChange ?? 0) > 0 ? "+" : ""}{(ticker.priceChange ?? 0).toFixed(2)}%
                </TableCell>
                <TableCell className="text-center">
                  <button 
                    onClick={() => onTickerSelect(ticker.symbol)}
                    className="p-2 rounded-full hover:bg-primary hover:text-black transition-all border border-white/10"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
