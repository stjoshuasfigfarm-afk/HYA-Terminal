"use client"

import React, { useEffect, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Info, Moon, Sun, Monitor, Waypoints, ShieldCheck, Cpu } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "../ui/skeleton"
import { describeApp } from "@/ai/flows/describe-app-flow";
import type { LogEntry } from "@/lib/types";
import ApiGatewayMap from "./api-gateway-map";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  apiStatus: { 
    finnhub: boolean | null; 
    alphaVantage: boolean | null; 
    financialModelingPrep: boolean | null; 
    marketStack: boolean | null; 
    tradingEconomics: boolean | null; 
    rapidApi: boolean | null; 
    yahooFinance: boolean | null; 
  };
  appDescription: string;
  setAppDescription: (description: string) => void;
  addLog: (type: LogEntry['type'], message: string) => void;
}

export default function SettingsPanel({ apiStatus, appDescription, setAppDescription, addLog }: SettingsPanelProps) {
  const { setTheme, theme } = useTheme();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!appDescription && !isPending) {
        startTransition(async () => {
            addLog("AI_QUERY", "GENERATING_APP_DESCRIPTION");
            try {
              const description = await describeApp();
              setAppDescription(description);
              addLog("AI_RESPONSE", "APP_DESCRIPTION_GENERATED");
            } catch (e: any) {
              addLog("FS_ERR", `APP_DESCRIPTION_FAILED: ${e.message}`);
              setAppDescription("Error generating application description. Verify Genkit configuration.");
            }
        });
    }
  }, [appDescription, setAppDescription, addLog, isPending]);

  const getApiKeyStatus = (key: keyof typeof apiStatus) => {
      const isValid = apiStatus[key];
      if (isValid === null) return { text: 'Validating...', color: 'text-yellow-400' };
      if (isValid) return { text: 'Active', color: 'text-green-400' };
      return { text: 'Offline', color: 'text-red-400' };
  }

  const finnhubStatus = getApiKeyStatus('finnhub');
  const fmpStatus = getApiKeyStatus('financialModelingPrep');
  const rapidStatus = getApiKeyStatus('rapidApi');
  const yahooStatus = getApiKeyStatus('yahooFinance');

  return (
    <div className="w-full max-w-4xl space-y-8 pb-12">
      <div className="flex flex-col gap-1 items-center text-center">
        <div className="p-3 bg-primary/10 rounded-full border border-primary/20 mb-2">
            <Cpu className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-black text-white font-headline uppercase tracking-tighter">System Configuration</h2>
        <p className="text-muted-foreground text-sm max-w-lg">Manage institutional data gateways, security attestations, and terminal session aesthetics.</p>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-primary">
          <Waypoints className="w-4 h-4" /> Service Topology Circuit
        </Label>
        <ApiGatewayMap apiStatus={apiStatus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel border-white/5 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-black text-primary tracking-widest">Appearance Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 bg-black/40 p-2 rounded-lg border border-white/5">
                <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme("dark")} className="flex-1 font-black uppercase text-[10px]">
                    <Moon className="w-3.5 h-3.5 mr-2"/> Dark
                </Button>
                <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme("light")} className="flex-1 font-black uppercase text-[10px]">
                    <Sun className="w-3.5 h-3.5 mr-2"/> Light
                </Button>
                <Button variant={theme === 'system' ? 'secondary' : 'ghost'} size="sm" onClick={() => setTheme("system")} className="flex-1 font-black uppercase text-[10px]">
                    <Monitor className="w-3.5 h-3.5 mr-2"/> System
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/5 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-black text-primary tracking-widest">Gateway Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase">RapidAPI Universal</span>
                    <span className="text-[9px] text-muted-foreground">Cross-Session Link</span>
                </div>
                <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black", rapidStatus.color)}>{rapidStatus.text}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase">Yahoo Institutional</span>
                    <span className="text-[9px] text-muted-foreground">Price Engine v4</span>
                </div>
                <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded bg-black", yahooStatus.color)}>{yahooStatus.text}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-black uppercase tracking-widest text-primary">Terminal Intelligence (AI_DESC)</Label>
        <Card className="glass-panel border-white/5 rounded-xl">
          <CardContent className="pt-6">
            <div className="text-[11px] font-mono leading-relaxed text-muted-foreground italic">
              {isPending || !appDescription ? (
                <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                </div>
              ) : (
                `"${appDescription}"`
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Alert className="glass-panel border-white/5 rounded-xl">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <AlertTitle className="text-[11px] font-black uppercase">Finnhub Extraction</AlertTitle>
                <AlertDescription className="text-[10px] text-muted-foreground">
                    Status: <span className={finnhubStatus.color}>{finnhubStatus.text}</span>. Real-time news ingestion and sentiment analysis track.
                </AlertDescription>
            </Alert>
            <Alert className="glass-panel border-white/5 rounded-xl">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <AlertTitle className="text-[11px] font-black uppercase">FMP Search Sync</AlertTitle>
                <AlertDescription className="text-[10px] text-muted-foreground">
                    Status: <span className={fmpStatus.color}>{fmpStatus.text}</span>. Identity validation and fundamental profile extraction.
                </AlertDescription>
            </Alert>
        </div>
    </div>
  )
}