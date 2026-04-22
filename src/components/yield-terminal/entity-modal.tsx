
"use client";

import React, { useEffect, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { TickerData } from "@/lib/types";
import { Loader, BrainCircuit } from "lucide-react";

const generateSyntheticTicker = (
  symbol: string,
  sector: string,
  description: string
): TickerData => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    const char = symbol.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  const deterministicRandom = () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
  
  const name = description || `${symbol} Analytical Node`;
  const cap = Math.floor(deterministicRandom() * 500 + 20) * 1_000_000_000;

  return {
    symbol,
    name: name.length > 30 ? name.substring(0, 30) + "..." : name,
    sector: sector || "Analytical Node",
    price: parseFloat((deterministicRandom() * 500 + 50).toFixed(2)),
    priceChange: parseFloat(((deterministicRandom() - 0.5) * 10).toFixed(2)),
    marketCap: cap,
    peRatio: parseFloat((deterministicRandom() * 50 + 10).toFixed(2)),
    beta: parseFloat((deterministicRandom() * 1.5 + 0.5).toFixed(2)),
    rsi: parseFloat((deterministicRandom() * 40 + 30).toFixed(2)),
    grossMargin: deterministicRandom() * 0.6,
    roe: deterministicRandom() * 0.4,
    debtToEquity: deterministicRandom() * 2,
    moatStatus: deterministicRandom() > 0.5 ? 'Wide' : 'Narrow',
    moatDescription: "Session-specific synthesized advantage.",
    isSynthesized: true,
    revenueSegments: [
      { label: "Core Operations", value: cap * 0.6 },
      { label: "Emerging Tech", value: cap * 0.4 }
    ],
    suppliers: [
      { name: "NVDA", type: "Compute", contractValue: "Strategic", summary: "Critical AI infrastructure.", status: 'Active', throughput: 1200000000 }
    ],
    midstream: [
      { name: "GLOBAL_CDN", type: "Network", contractValue: "Backbone", summary: "Primary distribution.", status: 'Active', throughput: 800000000 }
    ],
    customers: [
      { name: "ENTERPRISE_HUB", type: "Market", contractValue: "Revenue", summary: "Primary downstream gateway.", status: 'Active', throughput: 2000000000 }
    ],
    news: [
        {
            title: `Session Alert: Node ${symbol} initialized into structural grid.`,
            source: "Terminal Intelligence",
            sentiment: 'Bullish',
            publishedAt: Math.floor(Date.now() / 1000),
            url: "#",
        }
    ],
  };
};

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommit: (newTicker: string, data: TickerData) => void;
  existingTickers: string[];
  initialTicker?: string;
}

export default function EntityModal({
  isOpen,
  onClose,
  onCommit,
  existingTickers,
  initialTicker,
}: EntityModalProps) {
  const [isPending, startTransition] = useTransition();

  const formSchema = z.object({
    ticker: z
      .string()
      .min(1, "Ticker is required")
      .max(10, "Ticker must be 10 characters or less")
      .transform((val) => val.toUpperCase())
      .refine(
        (val) => !existingTickers.includes(val) || val === initialTicker,
        {
          message: "Node already exists in session.",
        }
      ),
    sector: z.string().optional(),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
      sector: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        ticker: initialTicker || "",
        sector: "",
        description: "",
      });
    }
  }, [isOpen, initialTicker, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      const data = generateSyntheticTicker(
        values.ticker,
        values.sector || "",
        values.description || ""
      );
      
      onCommit(values.ticker, data);
      form.reset();
      onClose();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black border-white/10 text-white backdrop-blur-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
              <BrainCircuit className="w-8 h-8 text-primary animate-pulse" />
              <DialogTitle className="font-headline text-primary text-2xl uppercase tracking-tighter">
                Synthesize Node
              </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 text-xs font-mono uppercase tracking-widest">
            Initialize a new structural entity. Metrics and logistics will be derived from session intelligence.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-primary/70">Node Identity (Ticker)</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="e.g., SYNT" 
                        {...field} 
                        disabled={isPending}
                        className="bg-white/5 border-white/10 text-primary font-black uppercase h-12 focus-visible:ring-primary/50"
                    />
                  </FormControl>
                  <FormMessage className="text-[9px] font-black" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-gray-500">Industry / Sector (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="e.g., Quantum Computing" 
                        {...field} 
                        disabled={isPending}
                        className="bg-white/5 border-white/10 h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-gray-500">Context / Driver (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                        placeholder="Explain the structural role..." 
                        {...field} 
                        disabled={isPending}
                        className="bg-white/5 border-white/10 min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isPending} className="text-gray-500 font-bold uppercase text-[10px]">
                Abort
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1 font-black uppercase text-[10px] tracking-widest h-12">
                {isPending ? (
                    <><Loader className="mr-2 h-4 w-4 animate-spin" /> INITIALIZING_NODE...</>
                ) : (
                    "Execute Synthesis"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
