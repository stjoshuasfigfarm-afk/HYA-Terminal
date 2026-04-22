
"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

function mkRng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function generateData(ticker: string, n = 800) {
  let seed = 0xABCD1234;
  for(let i=0; i<ticker.length; i++) seed += ticker.charCodeAt(i);
  
  const rng = mkRng(seed);
  const anchor = new Date();
  let close = 500.00;
  const out = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(anchor);
    d.setDate(anchor.getDate() - (n - i));
    const drift = (rng() - 0.47) * 7.4;
    close = Math.max(close + drift, 50);
    const wick = rng() * 5.2;
    out.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      time: "16:00",
      close: +close.toFixed(2),
      high: +(close + wick).toFixed(2),
      low: +(close - wick).toFixed(2),
      timestamp: d.getTime(),
    });
  }
  return out;
}

function calcSMA(closes: number[], period: number) {
  return closes.map((_, i) =>
    i < period - 1
      ? null
      : +(closes.slice(i - period + 1, i + 1).reduce((sum, val) => sum + val, 0) / period).toFixed(3)
  );
}

function aggregateMonthly(dailyData: any[]) {
  const months: any = {};
  dailyData.forEach(c => {
    const d = new Date(c.timestamp);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!months[key]) {
      months[key] = {
        close: c.close,
        high: c.high,
        low: c.low,
        date: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        timestamp: c.timestamp,
      };
    } else {
      months[key].high = Math.max(months[key].high, c.high);
      months[key].low = Math.min(months[key].low, c.low);
      months[key].close = c.close;
    }
  });
  return Object.values(months).sort((a: any, b: any) => a.timestamp - b.timestamp);
}

export default function ForgeFarmRelay({ ticker }: { ticker: string }) {
  const [range, setRange] = useState("1Y");
  const [showSMA, setShowSMA] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [svgW, setSvgW] = useState(800);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setSvgW(Math.floor(e.contentRect.width)));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const allData = useMemo(() => generateData(ticker, 800), [ticker]);
  
  const filtered = useMemo(() => {
    if (range === "2Y") {
        return aggregateMonthly(allData.slice(-730)) as any[];
    }
    const n = range === "1M" ? 22 : range === "3M" ? 66 : range === "1Y" ? 252 : 252;
    return allData.slice(-n);
  }, [allData, range]);

  const closes = useMemo(() => filtered.map(c => c.close), [filtered]);
  const sma9 = useMemo(() => calcSMA(closes, 9), [closes]);
  const sma21 = useMemo(() => calcSMA(closes, 21), [closes]);
  const sma50 = useMemo(() => calcSMA(closes, 50), [closes]);
  const sma200 = useMemo(() => calcSMA(closes, 200), [closes]);

  const PAD = { L: 45, R: 15, T: 15, B: 35 };
  const CHART_H = 340; 
  const plotW = svgW - PAD.L - PAD.R;

  const [priceMin, priceMax] = useMemo(() => {
    const vals = filtered.map(c => c.close);
    return [Math.min(...vals) * 0.95, Math.max(...vals) * 1.05];
  }, [filtered]);

  const priceRange = priceMax - priceMin;
  const spacing = plotW / filtered.length;

  const py = useCallback((v: number) => PAD.T + (1 - (v - priceMin) / priceRange) * (CHART_H - PAD.T - PAD.B), [priceMin, priceRange]);
  const cx = useCallback((i: number) => PAD.L + (i + 0.5) * spacing, [spacing]);

  const D_PriceTicks = useMemo(() => {
    const step = Math.max(1, Math.ceil(priceRange / 6));
    const ticks = [];
    for (let v = Math.floor(priceMin / step) * step; v <= priceMax; v += step) ticks.push(v);
    return ticks;
  }, [priceMin, priceMax, priceRange]);

  const D_DateTicks = useMemo(() => {
    const step = Math.max(1, Math.floor(filtered.length / 8));
    return filtered.map((c, i) => ({ label: `${c.date}`, x: cx(i) })).filter((_, i) => i % step === 0);
  }, [filtered, cx]);

  const buildPath = useCallback((arr: (number | null)[], func: (v: number) => number) => {
    let d = "", on = false;
    arr.forEach((v, i) => {
      if (v == null) { on = false; return; }
      d += `${on ? "L" : "M"}${cx(i).toFixed(1)},${func(v).toFixed(1)} `;
      on = true;
    });
    return d;
  }, [cx]);

  return (
    <div className="w-full h-full flex flex-col bg-black font-mono text-[10px] overflow-hidden">
      <div className="flex justify-between items-center p-2 px-3 border-b border-white/10 shrink-0 bg-white/[0.02]">
        <div className="flex gap-1.5 items-center">
          {["1M", "3M", "1Y", "2Y"].map(r => (
            <button key={r} onClick={() => setRange(r)} className={cn("px-2 py-0.5 border border-white/10 transition-all text-[9px] font-black uppercase rounded-sm", range === r ? "bg-primary text-black border-primary" : "text-muted-foreground hover:text-white hover:bg-white/5")}>
                {r === "2Y" ? "2Y (Monthly)" : r}
            </button>
          ))}
          <span className="text-[9px] text-primary ml-3 uppercase font-black tracking-widest opacity-60">{currentTime}</span>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => setShowSMA(!showSMA)} className={cn("px-2 py-0.5 border border-white/10 text-[8px] font-black uppercase rounded transition-all", showSMA ? "text-primary border-primary bg-primary/5" : "text-muted-foreground hover:bg-white/5")}>Indicators</button>
        </div>
      </div>

      <div ref={wrapRef} className="flex-1 relative overflow-hidden">
        <svg width={svgW} height={CHART_H} className="block cursor-crosshair">
          {D_PriceTicks.map(v => (
            <g key={v}>
              <line x1={PAD.L} y1={py(v)} x2={svgW - PAD.R} y2={py(v)} stroke="rgba(255,255,255,0.05)" />
              <text x={PAD.L - 8} y={py(v) + 3} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="7" fontWeight="bold">${v}</text>
            </g>
          ))}
          {D_DateTicks.map((t, i) => (
            <text key={i} x={t.x} y={CHART_H - 12} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontWeight="bold">{t.label}</text>
          ))}
          
          <g>
            {/* PERFORMANCE LINE CHART */}
            <path d={buildPath(closes, py)} fill="none" stroke="#fff" strokeWidth="2.5" className="transition-all duration-300" />
          </g>

          {showSMA && (
            <g>
              {/* INSTITUTIONAL SMA SUITE */}
              <path d={buildPath(sma9, py)} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.2" strokeOpacity="0.8" />
              <path d={buildPath(sma21, py)} fill="none" stroke="hsl(var(--secondary))" strokeWidth="1.2" strokeOpacity="0.8" />
              <path d={buildPath(sma50, py)} fill="none" stroke="#FFD700" strokeWidth="1.2" strokeOpacity="0.8" />
              <path d={buildPath(sma200, py)} fill="none" stroke="#FF4444" strokeWidth="1.2" strokeOpacity="0.8" />
            </g>
          )}
          
          <g transform="translate(60, 25)">
             <circle cx="0" cy="0" r="2.5" fill="hsl(var(--primary))" /> <text x="8" y="3" fill="rgba(255,255,255,0.6)" fontSize="7" fontWeight="black">SMA 9</text>
             <circle cx="50" cy="0" r="2.5" fill="hsl(var(--secondary))" /> <text x="58" y="3" fill="rgba(255,255,255,0.6)" fontSize="7" fontWeight="black">SMA 21</text>
             <circle cx="100" cy="0" r="2.5" fill="#FFD700" /> <text x="108" y="3" fill="rgba(255,255,255,0.6)" fontSize="7" fontWeight="black">SMA 50</text>
             <circle cx="155" cy="0" r="2.5" fill="#FF4444" /> <text x="163" y="3" fill="rgba(255,255,255,0.6)" fontSize="7" fontWeight="black">SMA 200</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
