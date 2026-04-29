
"use client";

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, Activity, ShieldAlert, Target } from "lucide-react";
import type { HistoricalDataPoint } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';

interface JeromeStrategyPanelProps {
  historicalData: HistoricalDataPoint[] | null;
  activeTicker: string;
}

const maLength = 200;
const stdDevMultiplier = 2.0;
const fibLevels = [0.236, 0.382, 0.618, 0.786];

export default function JeromeStrategyPanel({ historicalData, activeTicker }: JeromeStrategyPanelProps) {
  const analysis = useMemo(() => {
    if (!historicalData || historicalData.length < maLength) return null;

    const points = [...historicalData];
    const dataWithBands = points.map((p, i) => {
      if (i < maLength - 1) return { ...p };

      const slice = points.slice(i - maLength + 1, i + 1);
      const sma = slice.reduce((sum, item) => sum + item.hlc3, 0) / maLength;
      
      const variance = slice.reduce((sum, item) => sum + Math.pow(item.hlc3 - sma, 2), 0) / maLength;
      const stdDev = Math.sqrt(variance);
      
      const upperBand = sma + stdDevMultiplier * stdDev;
      const lowerBand = sma - stdDevMultiplier * stdDev;

      const fibUp = fibLevels.map(f => sma + f * (upperBand - sma));
      const fibDown = fibLevels.map(f => sma - f * (sma - lowerBand));

      return {
        ...p,
        sma,
        upperBand,
        lowerBand,
        fibUp1: fibUp[0],
        fibUp2: fibUp[1],
        fibUp3: fibUp[2],
        fibUp4: fibUp[3],
        fibDown1: fibDown[0],
        fibDown2: fibDown[1],
        fibDown3: fibDown[2],
        fibDown4: fibDown[3],
      };
    }).filter(p => !!p.sma);

    const latest = dataWithBands[dataWithBands.length - 1];
    const prev = dataWithBands[dataWithBands.length - 2];

    const deltaUp = latest.hlc3 > prev?.hlc3;
    const breakout = latest.close > latest.upperBand;
    const breakdown = latest.close < latest.lowerBand;

    let signal = "NEUTRAL";
    let color = "text-muted-foreground";
    
    if (breakout && deltaUp) {
      signal = "BO BULLISH";
      color = "text-green-400";
    } else if (breakdown && !deltaUp) {
      signal = "BD BEARISH";
      color = "text-red-400";
    }

    return {
      data: dataWithBands.slice(-50), // Show last 50 points for clarity
      signal,
      color,
      latest
    };
  }, [historicalData]);

  if (!analysis) {
    return (
      <Card className="bg-black/40 border-primary/20 h-full flex flex-col items-center justify-center p-6">
        <Activity className="w-8 h-8 text-primary/40 animate-pulse mb-2" />
        <p className="text-[10px] text-muted-foreground font-mono uppercase text-center">
          Accumulating sufficient institutional history...<br />
          (Requires {maLength} data points)
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-primary/20 flex flex-col h-full overflow-hidden">
      <CardHeader className="py-2 px-3 flex flex-row items-center justify-between space-y-0 shrink-0 border-b border-white/5">
        <CardTitle className="text-[10px] font-headline flex items-center gap-2 text-primary uppercase">
          <Zap className="w-4 h-4" /> Strategy Momentum Engine
        </CardTitle>
        <div className={cn("text-[10px] font-black font-mono flex items-center gap-2 px-2 py-0.5 rounded border border-white/10", analysis.color)}>
          <Target className="w-3 h-3" /> {analysis.signal}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analysis.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="time" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '9px' }}
                itemStyle={{ padding: '0px' }}
              />
              
              {/* Jerome Fib Bands */}
              <Line type="monotone" dataKey="upperBand" stroke="#00BCD4" strokeWidth={1} dot={false} strokeOpacity={0.5} />
              <Line type="monotone" dataKey="lowerBand" stroke="#f23645" strokeWidth={1} dot={false} strokeOpacity={0.5} />
              <Line type="monotone" dataKey="sma" stroke="#00BCD4" strokeWidth={2} dot={false} strokeDasharray="5 5" />
              
              {/* Fib Tiers */}
              <Line type="monotone" dataKey="fibUp1" stroke="#00BCD4" strokeWidth={0.5} dot={false} strokeOpacity={0.2} />
              <Line type="monotone" dataKey="fibUp4" stroke="#00BCD4" strokeWidth={0.5} dot={false} strokeOpacity={0.2} />
              <Line type="monotone" dataKey="fibDown1" stroke="#f23645" strokeWidth={0.5} dot={false} strokeOpacity={0.2} />
              <Line type="monotone" dataKey="fibDown4" stroke="#f23645" strokeWidth={0.5} dot={false} strokeOpacity={0.2} />

              <Line type="monotone" dataKey="close" stroke="#fff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 px-3 pb-3 shrink-0">
          <div className="bg-white/5 p-2 rounded border border-white/5">
            <span className="text-[8px] text-muted-foreground uppercase font-black block mb-1">Risk Threshold</span>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-red-400">${analysis.latest.lowerBand.toFixed(2)}</span>
              <ShieldAlert className="w-3 h-3 text-red-400" />
            </div>
          </div>
          <div className="bg-white/5 p-2 rounded border border-white/5">
            <span className="text-[8px] text-muted-foreground uppercase font-black block mb-1">Momentum Pivot</span>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-primary">${analysis.latest.sma.toFixed(2)}</span>
              <Activity className="w-3 h-3 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
