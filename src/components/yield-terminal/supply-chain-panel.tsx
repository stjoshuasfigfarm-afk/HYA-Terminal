"use client";

import type { TickerData } from "@/lib/types";
import { Truck, Factory, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupplyChainPanelProps {
  activeTicker: string;
  tickerData: Record<string, TickerData>;
  className?: string;
}

export default function SupplyChainPanel({ activeTicker, tickerData, className }: SupplyChainPanelProps) {
  const currentTicker = tickerData[activeTicker];

  if (!currentTicker) return null;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-3", className)}>
      {/* 1. UPSTREAM: SUPPLIERS */}
      <div className="bg-black/40 border border-red-500/20 rounded-lg p-3 flex flex-col">
        <h3 className="text-red-400 font-black text-xs mb-3 flex items-center gap-2 tracking-widest font-headline shrink-0">
          <Truck className="w-4 h-4" />
          UPSTREAM / SUPPLIERS
        </h3>
        <div className="space-y-2 flex-1 overflow-visible">
          {currentTicker.suppliers && currentTicker.suppliers.length > 0 ? (
            currentTicker.suppliers.map((supplier) => (
              <div key={supplier.name} className="text-[11px] p-2 rounded bg-red-500/5 border border-red-500/10 h-full">
                <p className="font-bold text-foreground">{supplier.name} <span className="font-normal text-muted-foreground">({supplier.type})</span></p>
                <p className="text-red-300/80 font-medium">{supplier.contractValue}</p>
                <p className="text-muted-foreground/80 mt-1 leading-relaxed">{supplier.summary}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-xs italic">NO_SUPPLIER_DATA_INDEXED</p>
          )}
        </div>
      </div>

      {/* 2. MIDSTREAM: PROCESSING / ASSEMBLY */}
      <div className="bg-black/40 border border-amber-500/20 rounded-lg p-3 flex flex-col">
        <h3 className="text-amber-400 font-black text-xs mb-3 flex items-center gap-2 tracking-widest font-headline shrink-0">
          <Factory className="w-4 h-4" />
          MIDSTREAM / LOGISTICS
        </h3>
        <div className="space-y-2 flex-1 overflow-visible">
          {currentTicker.midstream && currentTicker.midstream.length > 0 ? (
            currentTicker.midstream.map((mid) => (
              <div key={mid.name} className="text-[11px] p-2 rounded bg-amber-500/5 border border-amber-500/10 h-full">
                <p className="font-bold text-foreground">{mid.name} <span className="font-normal text-muted-foreground">({mid.type})</span></p>
                <p className="text-amber-300/80 font-medium">{mid.contractValue}</p>
                <p className="text-muted-foreground/80 mt-1 leading-relaxed">{mid.summary}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-xs italic">NO_MIDSTREAM_DATA_INDEXED</p>
          )}
        </div>
      </div>

      {/* 3. DOWNSTREAM: CUSTOMERS */}
      <div className="bg-black/40 border border-green-500/20 rounded-lg p-3 flex flex-col">
        <h3 className="text-green-400 font-black text-xs mb-3 flex items-center gap-2 tracking-widest font-headline shrink-0">
          <Users className="w-4 h-4" />
          DOWNSTREAM / CUSTOMERS
        </h3>
        <div className="space-y-2 flex-1 overflow-visible">
          {currentTicker.customers && currentTicker.customers.length > 0 ? (
            currentTicker.customers.map((customer) => (
               <div key={customer.name} className="text-[11px] p-2 rounded bg-green-500/5 border border-green-500/10 h-full">
                <p className="font-bold text-foreground">{customer.name} <span className="font-normal text-muted-foreground">({customer.type})</span></p>
                <p className="text-green-300/80 font-medium">{customer.contractValue}</p>
                <p className="text-muted-foreground/80 mt-1 leading-relaxed">{customer.summary}</p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-xs italic">NO_CUSTOMER_DATA_INDEXED</p>
          )}
        </div>
      </div>
    </div>
  );
}