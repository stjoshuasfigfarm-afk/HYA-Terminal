
export type TickerData = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  priceChange: number;
  volume?: number;
  marketCap: number;
  peRatio?: number;
  eps?: number;
  yearHigh?: number;
  yearLow?: number;
  beta?: number;
  rsi?: number;
  sma?: number;
  debtToEquity?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netMargin?: number;
  roe?: number;
  roa?: number;
  cashReserves?: number;
  totalDebt?: number;
  freeCashFlow?: number;
  receivables?: number;
  inventory?: number;
  fixedAssets?: number;
  currentLiabilities?: number;
  longTermDebt?: number;
  moatStatus?: 'Wide' | 'Narrow' | 'None';
  moatDescription?: string;
  isMacro?: boolean; 
  isSynthesized?: boolean; 
  isAttested?: boolean;
  dema?: any;
  earningsHistory?: {
    quarter: string;
    eps: number;
  }[];
  suppliers: SupplyChainNode[];
  midstream?: SupplyChainNode[];
  customers: SupplyChainNode[];
  news: {
    title: string;
    source: string;
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
    publishedAt: number;
    url: string;
  }[];
  description?: string;
  website?: string;
  image?: string;
  analystGrades?: {
    strongBuy: number;
    buy: number;
    hold: number;
    sell: number;
    strongSell: number;
  };
  revenueSegments?: {
    label: string;
    value: number;
  }[];
  updatedAt?: string;
  logisticsRiskScore?: number;
};

export type SupplyChainNode = {
  name: string;
  type: string;
  contractValue: string;
  summary: string;
  status: 'Active' | 'Bottlenecked' | 'Delayed' | 'IDLE';
  throughput: number; // Volume in USD or units
  geopoint?: { lat: number; lng: number };
  transitLinks?: {
    target: string;
    distanceKm: number;
    leadTimeDays: number;
    velocity: 'High' | 'Standard' | 'Low' | 'Stalled';
  }[];
};

export type LogEntry = {
  timestamp: Date;
  type: "INFO" | "FS_ERR" | "FS_SYNC" | "AI_QUERY" | "AI_RESPONSE";
  message: string;
};

export type TerminalPhaseResponse<T> = {
  data: T | null;
  status: "SILO_HIT" | "HARVEST_COMPLETE" | "GATE_BLOCKED" | "SYSTEM_ERROR";
  message: string;
  logs: { type: LogEntry["type"]; message: string }[];
};

export type Timeframe = '15m' | '1H' | '1D' | '5D' | '1M' | 'All';

export type HistoricalDataPoint = {
  date: string;
  time?: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  hlc3: number;
};

export type MacroData = {
  history: { date: string; t10: number; t2: number; spread: number }[];
  fedFunds: string;
  recessionProb: string;
  isInverted: boolean;
  currentSpread: number;
  corridorRiskScore: number;
};
