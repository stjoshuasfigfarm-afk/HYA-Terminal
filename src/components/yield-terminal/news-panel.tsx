"use client";

import React, { useState, useEffect } from "react";
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import type { TickerData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsPanelProps {
  ticker: TickerData;
}

const sentimentIcons = {
  Bullish: <TrendingUp className="w-4 h-4 text-green-400" />,
  Bearish: <TrendingDown className="w-4 h-4 text-red-400" />,
  Neutral: <Minus className="w-4 h-4 text-gray-400" />,
};

export default function NewsPanel({ ticker }: NewsPanelProps) {
  const { news } = ticker;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderArticle = (article: TickerData["news"][0], index: number) => (
    <a
      key={index}
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-white/10 p-2 hover:bg-primary hover:text-black transition-all group mb-1"
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-black text-[11px] leading-tight transition-colors">{article.title}</h4>
             <div className={cn("flex items-center gap-1 text-[9px] font-black shrink-0 ml-2 uppercase",
                article.sentiment === "Bullish" && "text-green-400 group-hover:text-black",
                article.sentiment === "Bearish" && "text-red-400 group-hover:text-black",
                article.sentiment === "Neutral" && "text-gray-400 group-hover:text-black"
            )}>
                {article.sentiment}
            </div>
          </div>
          <div className="text-[9px] opacity-70 flex items-center gap-2 font-black uppercase">
            <span>{article.source}</span>
            <span>&bull;</span>
            {isClient ? (
              <span>{new Date(article.publishedAt * 1000).toLocaleDateString()}</span>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
        </div>
      </div>
    </a>
  );

  return (
    <div className="h-full flex flex-col bg-black border border-white/10 overflow-hidden">
      <div className="p-2 border-b border-white/10 bg-white/5 shrink-0">
        <h3 className="text-white font-black text-[10px] flex items-center gap-2 uppercase tracking-widest">
          <Newspaper className="w-4 h-4 text-primary" />
          News Feed
        </h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
           {(!news || news.length === 0) && (
            <div className="flex items-center justify-center p-4">
              <p className="text-muted-foreground text-[10px] italic">NO_NEWS_FOUND for {ticker.symbol}</p>
            </div>
          )}
          {news?.map(renderArticle)}
        </div>
      </ScrollArea>
    </div>
  );
}
