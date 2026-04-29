
"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LabelList
} from 'recharts';
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

// US National Projections 2026 (Simulated BLS-aligned structural data)
const laborData = [
  { major: 'Nurse Pract.', growth: 38.5, sector: 'Healthcare', color: '#1d70e7' },
  { major: 'Phys Therapy', growth: 26.2, sector: 'Healthcare', color: '#3b82f6' },
  { major: 'Health Admin', growth: 28.4, sector: 'Healthcare', color: '#4f91f2' },
  
  { major: 'Data Science', growth: 35.2, sector: 'Technology', color: '#e12d1d' },
  { major: 'Info Security', growth: 32.8, sector: 'Technology', color: '#e84e40' },
  { major: 'Software Dev', growth: 25.6, sector: 'Technology', color: '#f07167' },
  { major: 'AI/ML Ops', growth: 34.1, sector: 'Technology', color: '#f5928a' },
  
  { major: 'Renewable Eng', growth: 44.2, sector: 'Engineering', color: '#1b8a3a' },
  { major: 'Electrical Eng', growth: 14.5, sector: 'Engineering', color: '#2da150' },
  { major: 'Industrial Eng', growth: 12.8, sector: 'Engineering', color: '#4cb86e' },
  
  { major: 'Supply Chain', growth: 18.4, sector: 'Business', color: '#9333ea' },
  { major: 'Fin. Analysis', growth: 9.5, sector: 'Business', color: '#a855f7' },
  { major: 'Market Research', growth: 13.2, sector: 'Business', color: '#c084fc' },
  
  { major: 'Counseling', growth: 18.2, sector: 'Community', color: '#f9a602' },
  { major: 'Special Ed', growth: 11.4, sector: 'Community', color: '#fbbf24' },
];

const chartConfig = {
  growth: { label: "National Projected Growth", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

export default function LaborDemandPanel() {
  return (
    <Card className="glass-panel border-white/10 shrink-0 overflow-hidden flex flex-col bg-black/40 rounded-xl shadow-2xl">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-white/10 bg-white/[0.02]">
        <div className="flex flex-col">
            <CardTitle className="text-[10px] font-headline flex items-center gap-2 text-primary uppercase font-black tracking-widest">
            <BarChart3 className="w-4 h-4" />
            2026 U.S. National Demand Index
            </CardTitle>
            <p className="text-[8px] text-muted-foreground uppercase font-black mt-0.5">High-Growth Occupations Across all U.S. Districts</p>
        </div>
        <TrendingUp className="w-4 h-4 text-green-400" />
      </CardHeader>
      <CardContent className="p-4 pt-6 flex-1 min-h-[450px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={laborData} margin={{ top: 40, right: 10, left: -20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis 
                dataKey="major" 
                angle={-45} 
                textAnchor="end" 
                interval={0} 
                fontSize={8} 
                tick={{ fill: "#888", fontWeight: "bold" }} 
                axisLine={false}
                tickLine={false}
                height={80}
              />
              <YAxis 
                fontSize={8} 
                tick={{ fill: "#666" }} 
                axisLine={false} 
                tickLine={false} 
                label={{ value: 'Projected National Growth (%)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 8, fill: '#444' }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px', borderRadius: '8px' }}
              />
              <Bar dataKey="growth" radius={[4, 4, 0, 0]}>
                {laborData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList 
                    dataKey="growth" 
                    position="top" 
                    fontSize={8} 
                    formatter={(val: number) => `${val}%`} 
                    fill="#aaa" 
                    style={{ fontWeight: 'black' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="flex flex-wrap justify-center gap-4 mt-4 border-t border-white/5 pt-4">
            {['Healthcare', 'Technology', 'Engineering', 'Business', 'Community'].map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: laborData.find(d => d.sector === s)?.color }} />
                    <span className="text-[8px] font-black uppercase text-muted-foreground">{s}</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
