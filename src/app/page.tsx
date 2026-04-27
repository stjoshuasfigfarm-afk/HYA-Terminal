'use client';

import React, { useState, useEffect, useCallback, useTransition, lazy, useRef, Suspense } from "react";
import { initialTickerData } from "@/lib/mock-data";
import type { TickerData, LogEntry } from "@/lib/types";
import { 
  RefreshCw, LayoutDashboard, BrainCircuit, Globe, ShieldAlert, 
  Settings as SettingsIcon, Terminal as TerminalIcon, Search, 
  Activity, TrendingUp, BarChart3, Database 
} from "lucide-react";
import FinancialMetrics from "@/components/yield-terminal/financial-metrics";
import HeaderEventLog from "@/components/yield-terminal/header-event-log";
import SearchInput from "@/components/yield-terminal/search-input";
import HeaderChangelog from "@/components/yield-terminal/header-changelog";
import TickerMarquee from "@/components/yield-terminal/ticker-marquee";
import { getFullTickerDataAction, validateApiKeyAction } from "./actions";
import { useFmpWebsocket } from "@/hooks/use-fmp-websocket";
import { cn } from "@/lib/utils";
import NewsPanel from "@/components/yield-terminal/news-panel";
import MacroHealthPanel from "@/components/yield-terminal/macro-health-panel";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import LiveSupplyChainTerminal from "@/components/yield-terminal/live-supply-chain-terminal";
import RegistryPanel from "@/components/yield-terminal/registry-panel";
import FinancialSummary from "@/components/yield-terminal/financial-summary";
import WatchlistPanel from "@/components/yield-terminal/watchlist-panel";
import EntityModal from "@/components/yield-terminal/entity-modal";
import LaborDemandPanel from "@/components/yield-terminal/labor-demand-panel";

const SettingsPanel = lazy(() => import("@/components/yield-terminal/settings-panel"));

type ViewState = 'DASHBOARD' | 'TOPOLOGY' | 'MACRO' | 'REGISTRY' | 'SETTINGS';

export default function Home() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  
  const [activeTicker, setActiveTicker] = useState<string>("SPY");
  const [tickerData, setTickerData] = useState<Record<string, TickerData>>(initialTickerData);
  const [watchlist, setWatchlist] = useState<string[]>(["AAPL", "NVDA", "TSM"]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>({});
  const [appDescription, setAppDescription] = useState("");
  const [isSynthesizeOpen, setIsSynthesizeOpen] = useState(false);
  const [synthesizeTarget, setSynthesizeTarget] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchedEnrichedData = useRef<Set<string>>(new Set());

  const addLog = useCallback((type: LogEntry["type"], message: string) => {
    setLogs((prev) => [...prev, { timestamp: new Date(), type, message }].slice(-100));
  }, []);

  // --- INSTITUTIONAL HOTKEY BINDING ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, ViewState> = {
        'F1': 'DASHBOARD', 'F2': 'TOPOLOGY', 'F3': 'MACRO', 'F4': 'REGISTRY', 'F5': 'SETTINGS'
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        setCurrentView(keyMap[e.key]);
        addLog("SYSTEM", `VIEW_MODE_TRANSITION: ${keyMap[e.key]}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addLog]);

  useEffect(() => {
    setIsMounted(true);
    const isDemo = sessionStorage.getItem("terminal_demo_active") === "true";
    setIsDemoActive(isDemo);
    if (!authLoading && !user && !isDemo) {
      router.push("/login");
    }

    const validateKeys = async () => {
      const result = await validateApiKeyAction();
      setApiStatus(result.details || {});
    };
    validateKeys();
  }, [user, authLoading, router]);

  const wsPriceData = useFmpWebsocket(activeTicker);

  const enrichTickerData = useCallback(async (symbol: string) => {
    if (fetchedEnrichedData.current.has(symbol)) return;
    startTransition(async () => {
      addLog("INFO", `FETCHING_NODE_DATA: ${symbol}`);
      const result = await getFullTickerDataAction(symbol);
      if (result.data) {
        setTickerData(prev => ({ ...prev, [symbol]: { ...prev[symbol], ...result.data } as TickerData }));
        fetchedEnrichedData.current.add(symbol);
        addLog("FS_SYNC", `NODE_REHYDRATED: ${symbol}`);
      }
    });
  }, [addLog]);

  useEffect(() => { if (activeTicker) enrichTickerData(activeTicker); }, [activeTicker, enrichTickerData]);

  const handleTickerResolve = useCallback(async (ticker: string) => {
    const symbol = ticker.toUpperCase();
    if (tickerData[symbol]) { setActiveTicker(symbol); return; }
    enrichTickerData(symbol);
    setActiveTicker(symbol);
  }, [tickerData, enrichTickerData]);

  const handleSynthesizeRequest = useCallback((ticker: string) => {
    setSynthesizeTarget(ticker);
    setIsSynthesizeOpen(true);
  }, []);

  const handleToggleWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  }, []);

  const handleCommitSynthesis = useCallback((symbol: string, data: TickerData) => {
    const dataWithFlag = { ...data, isSynthesized: true };
    setTickerData(prev => ({ ...prev, [symbol]: dataWithFlag }));
    setWatchlist(prev => [...new Set([...prev, symbol])]);
    setActiveTicker(symbol);
    addLog("AI_RESPONSE", `NODE_SYNTHESIZED: ${symbol}`);
  }, [addLog]);

  const liveData = {
    price: wsPriceData?.price || tickerData[activeTicker]?.price || 0,
    delta: tickerData[activeTicker]?.priceChange || 0,
  };

  if (!isMounted || (authLoading && !isDemoActive)) {
    return <div className="h-screen w-full flex items-center justify-center bg-black"><RefreshCw className="w-10 h-10 text-primary animate-spin" /></div>;
  }

  const renderView = () => {
    const currentTickerData = tickerData[activeTicker] || { symbol: activeTicker } as TickerData;
    switch (currentView) {
      case 'DASHBOARD':
        return (
          <div className="flex flex-col min-h-full p-2 gap-4 overflow-y-auto custom-scrollbar bg-black pb-32">
            <div className="w-full shrink-0">
                <FinancialMetrics 
                    ticker={currentTickerData} 
                    liveData={liveData} 
                    onToggleWatchlist={handleToggleWatchlist}
                    isWatched={watchlist.includes(activeTicker)}
                />
            </div>

            {/* MAIN TOPOLOGY & WORLD MAP GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 shrink-0">
                <div className="xl:col-span-2 min-h-[600px] glass-panel overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl relative">
                    <div className="p-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between backdrop-blur-md sticky top-0 z-10">
                        <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> Live Supply Chain Topology
                        </span>
                        <div className="flex items-center gap-4">
                            <span className="text-[8px] text-muted-foreground uppercase font-black tracking-tighter">Primary Node: {activeTicker}</span>
                        </div>
                    </div>
                    <div className="h-[600px]">
                        <LiveSupplyChainTerminal activeTicker={activeTicker} tickerData={tickerData} onTickerSelect={handleTickerResolve} livePrices={{}} />
                    </div>
                </div>

                {/* WORLD MARKET FLOW */}
                <div className="min-h-[600px] glass-panel rounded-xl border border-white/10 bg-black/40 shadow-2xl flex flex-col">
                    <div className="p-3 border-b border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#ffaa00] tracking-widest flex items-center gap-2">
                            <Globe className="w-4 h-4" /> Global Market Flow
                        </span>
                    </div>
                    <div className="flex-1 w-full grayscale hover:grayscale-0 transition-all duration-700">
                        <iframe 
                            src="https://www.tradingview-widget.com/embed-widget/market-quotes/?locale=en#%7B%22symbolsGroups%22%3A%5B%7B%22name%22%3A%22Major%20Indices%22%2C%22symbols%22%3A%5B%7B%22name%22%3A%22AMEX%3ASPY%22%7D%2C%7B%22name%22%3A%22NASDAQ%3AQQQ%22%7D%2C%7B%22name%22%3A%22INDEX%3ADXY%22%7D%2C%7B%22name%22%3A%22INDEX%3ANI225%22%7D%2C%7B%22name%22%3A%22INDEX%3ADAX%22%7D%5D%7D%5D%2C%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%7D"
                            className="w-full h-full border-none rounded-b-xl"
                        ></iframe>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr_380px] gap-4 w-full items-start">
              <div className="flex flex-col gap-4 min-w-0">
                <MacroHealthPanel onTickerSelect={handleTickerResolve} />
                <LaborDemandPanel />
              </div>
              <div className="flex flex-col gap-4 min-w-0">
                <FinancialSummary ticker={currentTickerData} />
              </div>
              <div className="flex flex-col gap-4 min-w-0">
                <WatchlistPanel 
                    symbols={watchlist} 
                    tickerData={tickerData} 
                    onTickerSelect={handleTickerResolve}
                    onRemove={handleToggleWatchlist}
                />
                <NewsPanel ticker={currentTickerData} />
              </div>
            </div>
          </div>
        );
      case 'TOPOLOGY':
        return (
          <div className="h-full p-2 overflow-y-auto">
              <div className="min-h-[900px] glass-panel overflow-hidden rounded-xl border border-white/5 shadow-2xl">
                  <LiveSupplyChainTerminal activeTicker={activeTicker} tickerData={tickerData} onTickerSelect={handleTickerResolve} livePrices={{}} />
              </div>
          </div>
        );
      case 'MACRO':
        return (
          <div className="max-w-6xl mx-auto w-full h-full p-2 overflow-y-auto custom-scrollbar flex flex-col gap-4 pb-24">
            <MacroHealthPanel onTickerSelect={handleTickerResolve} />
            <LaborDemandPanel />
          </div>
        );
      case 'REGISTRY':
        return (
          <div className="h-full p-4 overflow-auto custom-scrollbar max-w-6xl mx-auto w-full pb-24">
            <RegistryPanel tickerData={tickerData} onTickerSelect={handleTickerResolve} />
          </div>
        );
      case 'SETTINGS':
        return (
          <div className="h-full p-6 overflow-auto custom-scrollbar flex justify-center w-full pb-24">
            <Suspense fallback={<RefreshCw className="w-10 h-10 text-primary animate-spin" />}>
              <SettingsPanel 
                apiStatus={apiStatus} 
                appDescription={appDescription} 
                setAppDescription={setAppDescription} 
                addLog={addLog} 
              />
            </Suspense>
          </div>
        );
      default: return null;
    }
  };

  const navItems = [
    { id: 'DASHBOARD', label: 'Terminal', fkey: 'F1', icon: LayoutDashboard, panels: ['Metrics', 'Topology', 'Macro', 'Labor', 'Summary', 'News'] },
    { id: 'TOPOLOGY', label: 'Topology', fkey: 'F2', icon: BrainCircuit, panels: ['Chain Nodes', 'Relationships', 'Velocity'] },
    { id: 'MACRO', label: 'Macro', fkey: 'F3', icon: Globe, panels: ['Yield Dynamics', 'Sector Velocity', 'Labor Demand'] },
    { id: 'REGISTRY', label: 'Asset Index', fkey: 'F4', icon: ShieldAlert, panels: ['Node Registry', 'Price Delta'] },
    { id: 'SETTINGS', label: 'Systems', fkey: 'F5', icon: SettingsIcon, panels: ['Gateways', 'Aesthetics', 'Intel'] },
  ];

  return (
      <div className="flex flex-col h-[100dvh] text-foreground font-mono text-xs overflow-hidden bg-black selection:bg-primary selection:text-black">
        <header className="flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/10 py-2 px-4 shrink-0 z-50">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => setCurrentView('DASHBOARD')}>
              <div className="bg-primary p-1 rounded-md">
                <TerminalIcon className="w-4 h-4 md:w-5 md:h-5 text-black" />
              </div>
              <span className="text-[10px] md:text-sm font-black text-primary uppercase tracking-tight hidden sm:inline">Analysis Terminal</span>
            </div>
            <div className="flex items-center gap-2 border-l border-white/10 pl-4 lg:pl-6">
                <span className="text-[8px] md:text-[10px] text-white font-black uppercase tracking-widest">Search</span>
                <SearchInput onTickerResolve={handleTickerResolve} onSynthesizeRequest={handleSynthesizeRequest} tickerData={tickerData} />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <HeaderEventLog logs={logs} />
            <HeaderChangelog />
            <div className="text-[8px] md:text-[9px] text-muted-foreground uppercase font-black px-2 py-1 border border-white/5 bg-white/[0.02] rounded-md hidden md:block">
                VER_4.5.0_STABLE
            </div>
          </div>
        </header>
        
        <TickerMarquee />
        
        <div className="flex flex-1 overflow-hidden relative">
          {/* INSTITUTIONAL SIDEBAR */}
          <aside className="hidden lg:flex w-52 border-r border-white/10 bg-black/40 flex-col py-4 shrink-0 overflow-y-auto custom-scrollbar">
            <div className="px-4 mb-6">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">System Navigation</span>
            </div>
            
            <div className="flex flex-col gap-1 px-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewState)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 transition-all rounded-md group relative",
                    currentView === item.id 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", currentView === item.id ? "text-primary" : "text-muted-foreground/60")} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  {currentView === item.id && <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full shadow-[0_0_8px_#26A69A]" />}
                </button>
              ))}
            </div>

            <div className="mt-8 px-4">
               <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                  <Activity className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Active Panels</span>
               </div>
               <div className="flex flex-col gap-3">
                  {navItems.find(n => n.id === currentView)?.panels.map((panel) => (
                    <div key={panel} className="flex items-center gap-2 group cursor-default">
                       <div className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                       <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter group-hover:text-white transition-colors">{panel}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="mt-auto p-4 space-y-4">
               <div className="bg-primary/5 border border-primary/20 p-2.5 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black text-primary uppercase">Silo Status</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-3/4 animate-pulse" />
                  </div>
               </div>
               <div className="flex items-center gap-2 opacity-40">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[7px] font-black text-white uppercase tracking-widest">Auth_Encrypted</span>
               </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 overflow-y-auto relative bg-black custom-scrollbar">
            {renderView()}
          </main>
        </div>

        {/* BOTTOM NAV (MOBILE FOCUSED) */}
        <nav className="bg-black border-t border-white/10 w-full grid grid-cols-5 shrink-0 h-14 md:h-16 z-50 overflow-hidden lg:hidden">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as ViewState)}
                    className={cn(
                        "h-full flex flex-col items-center justify-center transition-all duration-150 relative",
                        currentView === item.id 
                            ? "bg-primary text-black" 
                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                >
                    <span className={cn("text-[7px] md:text-[8px] font-black absolute top-1 left-2", currentView === item.id ? "text-black/60" : "text-primary/40")}>{item.fkey}</span>
                    <item.icon className="w-4 h-4 md:w-5 md:h-5 mb-0.5 md:mb-1" /> 
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
            ))}
        </nav>

        <EntityModal 
          isOpen={isSynthesizeOpen} 
          onClose={() => setIsSynthesizeOpen(false)} 
          onCommit={handleCommitSynthesis}
          existingTickers={Object.keys(tickerData)}
          initialTicker={synthesizeTarget}
        />
      </div>
  );
}
