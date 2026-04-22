
"use client";

import React, { useEffect, useState, useTransition, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Gauge, RefreshCw, Activity, Layers, ShieldCheck, Volume2, Loader2, AlertTriangle, Target, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line, CartesianGrid, Tooltip } from "recharts";
import { fetchMacroHealthAction, generateMacroAudioReportAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { MacroData } from "@/lib/types";

const sectorPerformance = [
  { name: 'AI Infrastructure', symbol: 'SMH', change: 4.2, color: 'hsl(var(--primary))' },
  { name: 'Information Technology', symbol: 'XLK', change: 3.1, color: 'hsl(var(--secondary))' },
  { name: 'Financial Services', symbol: 'XLF', change: 2.5, color: 'hsl(var(--primary))' },
  { name: 'Semiconductors', symbol: 'SOXX', change: 3.8, color: 'hsl(var(--secondary))' },
  { name: 'Consumer Discretionary', symbol: 'XLY', change: 1.5, color: 'hsl(var(--primary))' },
  { name: 'Healthcare', symbol: 'XLV', change: -0.8, color: '#666' },
  { name: 'Industrials', symbol: 'XLI', change: -2.4, color: '#888' },
  { name: 'Energy', symbol: 'XLE', change: -3.1, color: '#ff4444' },
];

const mockVixData = [
  { time: "09:30", value: 14.5 },
  { time: "10:30", value: 15.2 },
  { time: "11:30", value: 14.8 },
  { time: "12:30", value: 15.1 },
  { time: "13:30", value: 16.4 },
  { time: "14:30", value: 15.8 },
  { time: "15:30", value: 15.5 },
];

const radarConfig = {
  momentum: {
    label: 'Momentum',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const vixConfig = {
  value: { label: "VIX", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;

export default function MacroHealthPanel({ onTickerSelect }: { onTickerSelect: (ticker: string) => void }) {
  const [macroData, setMacroData] = useState<MacroData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isAudioPending, setIsAudioPending] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    startTransition(async () => {
      const result = await fetchMacroHealthAction();
      if (result?.data) setMacroData(result.data);
    });
  }, []);

  const latest = macroData?.history?.slice(-1)[0] || { t10: 4.28, t2: 4.41, spread: -0.13 };

  const handlePlayAudioReport = async () => {
    if (isAudioPending) return;
    setIsAudioPending(true);
    
    try {
      const result = await generateMacroAudioReportAction({
        t10: latest.t10,
        t2: latest.t2,
        fedFunds: macroData?.fedFunds || "5.50",
        sectors: sectorPerformance
      });

      if (result && result.audioDataUri) {
        if (audioRef.current) {
          audioRef.current.src = result.audioDataUri;
          audioRef.current.play();
        }
      }
    } catch (e) {
      console.error("Audio_Report_Failed:", e);
    } finally {
      setIsAudioPending(false);
    }
  };

  const radarData = sectorPerformance.map(s => ({
    name: s.name,
    momentum: Math.max(10, Math.min(100, (s.change + 5) * 10))
  }));

  return (
    <Card className="glass-panel border-white/10 shrink-0 overflow-hidden flex flex-col rounded-xl bg-black/40 shadow-2xl">
      <audio ref={audioRef} className="hidden" />
      <CardHeader className="py-2.5 px-4 flex flex-row items-center justify-between border-b border-white/10 bg-white/[0.03]">
        <CardTitle className="text-[10px] flex items-center gap-2 text-primary uppercase font-black tracking-widest">
          <Gauge className="w-4 h-4" /> Macro Corridor
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-primary hover:bg-primary hover:text-black transition-all rounded-full"
            onClick={handlePlayAudioReport}
            disabled={isAudioPending}
          >
            {isAudioPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <RefreshCw className={cn("w-4 h-4 text-muted-foreground/50", isPending && "animate-spin")} />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-4 flex flex-col gap-6 overflow-hidden">
        
        {/* SHRUNKEN VIX WITH DUAL AXES */}
        <div className="space-y-2 shrink-0 bg-black/40 p-3 border border-white/5 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-destructive" />
                    <span className="text-[10px] font-black text-destructive uppercase tracking-widest">VIX Volatility Index</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-white">15.5</span>
                    <span className="text-[9px] text-green-400 font-bold">Systemic Risk Track</span>
                </div>
            </div>
            <div className="h-[120px] w-full">
                <ChartContainer config={vixConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockVixData} margin={{ left: -10, right: 10, bottom: 0, top: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis 
                              dataKey="time" 
                              fontSize={8} 
                              tick={{ fill: "#666", fontWeight: "bold" }} 
                              axisLine={false} 
                              tickLine={false} 
                            />
                            <YAxis 
                              fontSize={8} 
                              tick={{ fill: "#666", fontWeight: "bold" }} 
                              axisLine={false} 
                              tickLine={false} 
                              domain={['auto', 'auto']}
                              label={{ value: 'Index', angle: -90, position: 'insideLeft', fontSize: 7, fill: '#444' }}
                            />
                            <Tooltip content={<ChartTooltipContent hideLabel />} />
                            <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>

        {/* DOMINANT SECTOR VELOCITY RADAR */}
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-[11px] font-black text-primary uppercase tracking-widest">Sector Velocity Monitor</span>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg flex items-start gap-3 shadow-inner">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[9px] text-muted-foreground leading-tight uppercase font-black">
              Kiviat Mapping: Radial boundaries identify momentum leadership quadrants. Radial lines provide separation for cross-sector structural triage.
            </p>
          </div>

          <div className="h-[400px] w-full relative bg-black/60 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                <ChartContainer config={radarConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="80%">
                            <PolarGrid stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                            <PolarAngleAxis 
                                dataKey="name" 
                                tick={{ fill: "#aaa", fontSize: 8, fontWeight: 'black' }} 
                            />
                            <PolarRadiusAxis 
                                domain={[0, 100]} 
                                tick={false} 
                                axisLine={false} 
                            />
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Radar
                                name="Momentum"
                                dataKey="momentum"
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary))"
                                fillOpacity={0.4}
                                strokeWidth={3}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* INSTITUTIONAL ROTATION GRID (STATIC VERTICAL BAR) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-secondary" />
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Institutional Rotation Grid</span>
                </div>
                <div className="bg-black/60 p-4 border border-white/10 rounded-xl h-[450px] shadow-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectorPerformance} layout="vertical" margin={{ left: -10, right: 40, top: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" fontSize={9} width={130} tick={{ fill: '#bbb', fontWeight: '900' }} axisLine={false} tickLine={false}/>
                        <Bar dataKey="change" barSize={18} radius={[0, 4, 4, 0]} className="cursor-pointer" onClick={(d) => onTickerSelect(d.symbol)}>
                        {sectorPerformance.map((e, idx) => <Cell key={`cell-${idx}`} fill={e.color} />)}
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
