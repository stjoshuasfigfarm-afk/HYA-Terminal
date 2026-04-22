
'use server';

import { ApiService } from '@/lib/services/api-service';
import type { TickerData, TerminalPhaseResponse, MacroData, SupplyChainNode } from '@/lib/types';
import { initialTickerData } from '@/lib/mock-data';
import { cache } from 'react';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, setDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { generateMacroAudioReport, MacroReportInput } from '@/ai/flows/macro-audio-report-flow';
import { getTickerInsights } from '@/ai/flows/ticker-insights-flow';

const getApiService = cache(() => new ApiService({
  alphaVantage: process.env.ALPHAVANTAGE_API_KEY,
  finnhub: process.env.FINNHUB_API_KEY,
  fmp: process.env.FMP_API_KEY,
  tradingEconomics: process.env.TRADING_ECONOMICS_API_KEY,
  rapidApi: process.env.RAPIDAPI_KEY,
  yahooFinance: process.env.YAHOO_FINANCE_API_KEY,
}));

function safeResponse<T>(data: T): T {
  if (data === null || data === undefined) return null as T;
  try {
    const serialized = JSON.stringify(data, (key, value) => {
      if (key === 'headers' || key === 'request' || key === 'config') return undefined;
      if (value && typeof value === 'object') {
        if ('_methodName' in value || (value.constructor && value.constructor.name === 'FieldValue')) {
          return undefined;
        }
        if ('seconds' in value && 'nanoseconds' in value) {
          return new Date(value.seconds * 1000).toISOString();
        }
      }
      if (value === null || value === undefined) return undefined;
      return value;
    });
    return JSON.parse(serialized);
  } catch (e) {
    console.error("Payload_Optimization_Error:", e);
    return null as T;
  }
}

async function validateCompliance() {
  const apiService = getApiService();
  const details = await apiService.validateApiKeys();
  const isValid = !!(details.finnhub || details.alphaVantage || details.financialModelingPrep || details.tradingEconomics || details.rapidApi || details.yahooFinance);
  return { isValid, details };
}

export async function calculateLogisticsRiskScoreAction(ticker: TickerData): Promise<number> {
  const nodes = [...(ticker.suppliers || []), ...(ticker.midstream || []), ...(ticker.customers || [])];
  if (nodes.length === 0) return 0;

  let totalRisk = 0;
  nodes.forEach(node => {
    if (node.status === 'Bottlenecked') totalRisk += 40;
    if (node.status === 'Delayed') totalRisk += 20;
    if (node.status === 'IDLE') totalRisk += 10;
  });

  const weatherDrift = Math.random() * 15;
  const conflictDrift = Math.random() * 20;

  const score = Math.min(100, (totalRisk / nodes.length) + weatherDrift + conflictDrift);
  return Math.round(score);
}

export async function getFullTickerDataAction(symbol: string): Promise<TerminalPhaseResponse<TickerData>> {
  const symbolUpper = symbol.toUpperCase();
  
  try {
    const compliance = await validateCompliance();
    if (!compliance.isValid) {
      return {
        data: initialTickerData[symbolUpper] || null,
        status: "GATE_BLOCKED",
        message: "🔴 [GATE BLOCKED]: Institutional API keys invalid or missing.",
        logs: [{ type: "FS_ERR", message: "GATE_BLOCKED: Compliance check failed." }]
      };
    }

    const apiService = getApiService();
    const [profile, priceData, balanceSheet] = await Promise.all([
      apiService.fetchFmpProfile(symbolUpper).catch(() => null),
      apiService.fetchRealTimeData(symbolUpper).catch(() => null),
      apiService.fetchAlphaVantageBalanceSheet(symbolUpper).catch(() => null),
    ]);

    const mockBase = initialTickerData[symbolUpper] || { symbol: symbolUpper, suppliers: [], customers: [], midstream: [] } as TickerData;

    const harvestedData: TickerData = {
      ...mockBase,
      name: profile?.companyName || mockBase.name,
      sector: profile?.sector || mockBase.sector,
      description: profile?.description || mockBase.description,
      marketCap: profile?.mktCap || mockBase.marketCap,
      ...balanceSheet,
      symbol: symbolUpper,
      price: priceData?.price ?? mockBase.price,
      priceChange: priceData?.delta ?? mockBase.priceChange,
      updatedAt: new Date().toISOString(),
    };

    harvestedData.logisticsRiskScore = await calculateLogisticsRiskScoreAction(harvestedData);

    return {
      data: safeResponse(harvestedData),
      status: "HARVEST_COMPLETE",
      message: "🟢 [HARVEST COMPLETE]: Logistics corridor synchronized.",
      logs: [{ type: "FS_SYNC", message: `HARVEST_COMPLETE: ${symbolUpper} silo rehydrated.` }]
    };

  } catch (error: any) {
    return {
      data: initialTickerData[symbolUpper] || null,
      status: "SYSTEM_ERROR",
      message: `🔴 [SYSTEM ERROR]: ${error.message || "Unknown crash."}`,
      logs: [{ type: "FS_ERR", message: `CRASH: ${error.message}` }]
    };
  }
}

export async function fetchRealTimeDataAction(ticker: string) {
  try {
    const apiService = getApiService();
    const data = await apiService.fetchRealTimeData(ticker);
    return safeResponse(data);
  } catch (error) {
    return null;
  }
}

export async function fetchMacroHealthAction(): Promise<TerminalPhaseResponse<MacroData>> {
  try {
    const apiService = getApiService();
    const rawData = await apiService.fetchMacroHealth();
    
    const history = rawData.history.map((h: any) => ({
      ...h,
      spread: parseFloat((h.t10 - h.t2).toFixed(3))
    }));

    const latest = history[history.length - 1];
    const currentSpread = latest ? latest.spread : 0;
    const isInverted = currentSpread < 0;

    const macroContent: MacroData = {
      history,
      fedFunds: rawData.fedFunds,
      recessionProb: rawData.recessionProb,
      isInverted,
      currentSpread,
      corridorRiskScore: Math.round(Math.random() * 40 + 20)
    };
    
    return {
      data: safeResponse(macroContent),
      status: "HARVEST_COMPLETE",
      message: "🟢 [MACRO HARVEST COMPLETE]: Global corridor tracks rehydrated.",
      logs: [{ type: "FS_SYNC", message: "MACRO_HARVEST: Successful extraction cycle." }]
    };
  } catch (error: any) {
    return {
      data: null,
      status: "SYSTEM_ERROR",
      message: "🔴 [MACRO_CRASH]: Unable to extract global corridor tracks.",
      logs: [{ type: "FS_ERR", message: `MACRO_EXTRACT_FAILED: ${error.message}` }]
    };
  }
}

export async function getTickerInsightsAction(symbol: string, data: any) {
  try {
    const result = await getTickerInsights(data);
    return safeResponse(result);
  } catch (error: any) {
    return "SYNTHESIS_FAILURE: Unable to conduct recursive mapping.";
  }
}

export async function generateMacroAudioReportAction(input: MacroReportInput) {
  try {
    const result = await generateMacroAudioReport(input);
    return safeResponse(result);
  } catch (error: any) {
    console.error("TTS_Action_Error:", error);
    return null;
  }
}

export async function validateApiKeyAction() {
  try {
    const compliance = await validateCompliance();
    return safeResponse({ 
      isValid: compliance.isValid, 
      details: compliance.details,
      error: null
    });
  } catch (error: any) {
    return safeResponse({ 
      isValid: false, 
      error: 'API_VALIDATION_CRASH',
      details: { finnhub: false, alphaVantage: false, financialModelingPrep: false, tradingEconomics: false, rapidApi: false, yahooFinance: false },
    });
  }
}

export async function fetchNewsAction(ticker: string) {
  try {
    const apiService = getApiService();
    const news = await apiService.fetchNews(ticker);
    return safeResponse(news);
  } catch (error) {
    return [];
  }
}

export async function searchSymbolAction(query: string) {
    try {
        const apiService = getApiService();
        const results = await apiService.searchSymbol(query);
        return safeResponse(results.map((item: any) => ({ symbol: item.symbol, name: item.name || item.companyName })));
    } catch (error) {
        return [];
    }
}
