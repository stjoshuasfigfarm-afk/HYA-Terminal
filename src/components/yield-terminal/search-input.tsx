
"use client";

import React, { useState, useEffect } from "react";
import { Search, BrainCircuit, Database } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { TickerData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { searchSymbolAction } from "@/app/actions";

interface SearchInputProps {
  onTickerResolve: (ticker: string) => void;
  onSynthesizeRequest: (ticker: string) => void;
  tickerData: Record<string, TickerData>;
}

interface Suggestion {
  symbol: string;
  name: string;
  isExisting?: boolean;
}

export default function SearchInput({ onTickerResolve, onSynthesizeRequest, tickerData }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setIsPopoverOpen(false);
      return;
    }

    const fetchSuggestions = async () => {
        const queryUpper = query.toUpperCase();
        
        const localSuggestions = Object.keys(tickerData)
            .filter((ticker) => ticker.toUpperCase().startsWith(queryUpper))
            .map((symbol) => ({ symbol, name: tickerData[symbol].name, isExisting: true }));
        
        const remoteSuggestions: any[] = await searchSymbolAction(query);
        const remoteMapped = (remoteSuggestions || []).map(item => ({
            symbol: item.symbol,
            name: item.name || item.companyName,
            isExisting: false
        }));

        const combinedSuggestions: Suggestion[] = [...localSuggestions];
        remoteMapped.forEach(remote => {
            if (!combinedSuggestions.some(local => local.symbol === remote.symbol)) {
                combinedSuggestions.push(remote);
            }
        });

        setSuggestions(combinedSuggestions);
        setIsPopoverOpen(true);
    };
    
    const handler = setTimeout(() => {
      fetchSuggestions();
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [query, tickerData]);

  const handleSelect = (ticker: string) => {
    setQuery("");
    onTickerResolve(ticker);
    setIsPopoverOpen(false);
  };

  const handleSynthesize = (ticker: string) => {
    setQuery("");
    onSynthesizeRequest(ticker);
    setIsPopoverOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0].symbol);
    } else if (query) {
       onTickerResolve(query.toUpperCase());
       setQuery("");
       setIsPopoverOpen(false);
    }
  };

  const exactMatch = Object.keys(tickerData).find(s => s.toUpperCase() === query.toUpperCase());

  return (
    <form onSubmit={handleSubmit} className="relative w-72 group">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 bg-black/50 border border-white/10 px-2.5 rounded hover:border-primary/50 transition-colors h-8 shadow-inner">
            <Search className="w-3.5 h-3.5 text-primary/40" />
            <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent border-none text-primary text-[10px] font-black uppercase placeholder:text-primary/20 focus:outline-none focus:ring-0 p-0 tracking-wider"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-80 bg-black border border-white/20 shadow-2xl backdrop-blur-2xl"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col">
            {suggestions.map((item) => (
              <button
                key={item.symbol}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(item.symbol);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-white/5 hover:bg-primary hover:text-black transition-all flex items-center justify-between group/item",
                  "focus-visible:outline-none"
                )}
              >
                <div className="flex flex-col">
                    <span className="font-black text-xs flex items-center gap-2">
                        {item.symbol}
                        {item.isExisting && <Database className="w-3 h-3 opacity-40" />}
                    </span>
                    <span className="text-[8px] opacity-70 uppercase truncate max-w-[160px] font-bold">{item.name}</span>
                </div>
                <span className="text-[8px] font-black opacity-0 group-hover/item:opacity-40 uppercase tracking-widest">Load_Node</span>
              </button>
            ))}
            
            {!exactMatch && query.length > 0 && (
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleSynthesize(query.toUpperCase());
                    }}
                    className="w-full text-left px-4 py-4 bg-primary/10 hover:bg-primary hover:text-black transition-all flex items-center gap-4"
                >
                    <BrainCircuit className="w-5 h-5" />
                    <div className="flex flex-col">
                        <span className="font-black text-xs uppercase">Synthesize {query.toUpperCase()}</span>
                        <span className="text-[8px] opacity-70 uppercase font-black">Initialize structural node from session context</span>
                    </div>
                </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </form>
  );
}
