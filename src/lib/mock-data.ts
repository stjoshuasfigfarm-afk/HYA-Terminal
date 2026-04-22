
import type { TickerData } from "./types";

export const initialTickerData: Record<string, TickerData> = {
  SPY: {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    sector: "Market Benchmark / Index",
    price: 597.45,
    priceChange: 0.62,
    volume: 65_000_000,
    marketCap: 580000000000,
    isMacro: true,
    peRatio: 24.2,
    eps: 22.40,
    yearHigh: 610.00,
    yearLow: 480.00,
    beta: 1.0,
    rsi: 55.4,
    grossMargin: 0.12,
    roe: 0.15,
    debtToEquity: 0.10,
    cashReserves: 145000000000,
    receivables: 42000000000,
    inventory: 15000000000,
    fixedAssets: 285000000000,
    description: "The S&P 500 benchmark for US Large-Cap equity performance.",
    moatStatus: 'Wide',
    moatDescription: 'Institutional liquidity and settlement standard.',
    analystGrades: { strongBuy: 45, buy: 20, hold: 10, sell: 2, strongSell: 0 },
    earningsHistory: [
      { quarter: 'Q1 24', eps: 5.20 },
      { quarter: 'Q2 24', eps: 5.45 },
      { quarter: 'Q3 24', eps: 5.80 },
      { quarter: 'Q4 24', eps: 6.10 }
    ],
    revenueSegments: [
      { label: "Technology", value: 185000000000 },
      { label: "Financials", value: 125000000000 },
      { label: "Healthcare", value: 95000000000 },
      { label: "Consumer", value: 75000000000 }
    ],
    suppliers: [
      { name: "AAPL", type: "Weight", contractValue: "7.1%", summary: "Primary tech driver.", status: 'Active', throughput: 1200000000, geopoint: { lat: 37.33, lng: -122.03 } },
      { name: "MSFT", type: "Weight", contractValue: "6.8%", summary: "Software infra node.", status: 'Active', throughput: 1100000000, geopoint: { lat: 47.67, lng: -122.12 } }
    ],
    customers: [
      { name: "Passive Funds", type: "Index", contractValue: "Universal", summary: "Standard tracking vehicle.", status: 'Active', throughput: 5000000000 }
    ],
    news: [{ title: "S&P 500 Hits New Record High Amid Tech Surge", source: "CNBC", sentiment: "Bullish", publishedAt: 1738195200, url: "#" }]
  },
  AAPL: { 
    symbol: "AAPL", 
    name: "Apple Inc.", 
    sector: "Consumer Electronics", 
    price: 232.15, 
    priceChange: 1.2, 
    marketCap: 3550000000000, 
    peRatio: 32.4,
    cashReserves: 162000000000,
    receivables: 35000000000,
    inventory: 6000000000,
    fixedAssets: 43000000000,
    description: "Designs, manufactures, and markets smartphones and computers.",
    earningsHistory: [
      { quarter: 'Q1 24', eps: 1.53 },
      { quarter: 'Q2 24', eps: 1.62 },
      { quarter: 'Q3 24', eps: 1.58 },
      { quarter: 'Q4 24', eps: 1.74 }
    ],
    revenueSegments: [
      { label: "iPhone", value: 200000000000 },
      { label: "Services", value: 85000000000 },
      { label: "Wearables", value: 40000000000 },
      { label: "Mac", value: 30000000000 }
    ],
    suppliers: [
      { name: "TSM", type: "Foundry", contractValue: "Exclusive", summary: "Custom silicon manufacturing.", status: 'Active', throughput: 15000000000, geopoint: { lat: 24.77, lng: 120.99 }, transitLinks: [{ target: "AAPL", distanceKm: 10500, leadTimeDays: 12 }] },
      { name: "STmicro", type: "Sensors", contractValue: "Tier-2", summary: "Sensing component node.", status: 'Delayed', throughput: 450000000, geopoint: { lat: 45.46, lng: 9.19 } }
    ],
    customers: [
      { name: "Global Retail", type: "Direct", contractValue: "Mass", summary: "Consumer electronics gateway.", status: 'Active', throughput: 200000000000 }
    ],
    news: [] 
  },
  TSM: {
    symbol: "TSM",
    name: "Taiwan Semiconductor Mfg Co.",
    sector: "Foundry / Semiconductors",
    price: 198.40,
    priceChange: 1.8,
    marketCap: 1020000000000,
    peRatio: 30.5,
    cashReserves: 48000000000,
    receivables: 12000000000,
    inventory: 8000000000,
    fixedAssets: 95000000000,
    description: "World's largest independent semiconductor foundry.",
    earningsHistory: [
      { quarter: 'Q1 24', eps: 1.28 },
      { quarter: 'Q2 24', eps: 1.35 },
      { quarter: 'Q3 24', eps: 1.42 },
      { quarter: 'Q4 24', eps: 1.51 }
    ],
    revenueSegments: [
      { label: "HPC", value: 45000000000 },
      { label: "Smartphone", value: 35000000000 },
      { label: "IoT", value: 10000000000 },
      { label: "Auto", value: 5000000000 }
    ],
    suppliers: [
      { name: "ASML", type: "Equipment", contractValue: "Critical", summary: "EUV lithography provider.", status: 'Active', throughput: 4500000000, geopoint: { lat: 51.40, lng: 5.41 } }
    ],
    customers: [
      { name: "AAPL", type: "Primary", contractValue: "Strategic", summary: "Sole A-series manufacturer.", status: 'Active', throughput: 15000000000 },
      { name: "NVDA", type: "AI Node", contractValue: "High-Yield", summary: "GPU fabrication partner.", status: 'Bottlenecked', throughput: 8500000000 }
    ],
    news: []
  },
  NVDA: { 
    symbol: "NVDA", 
    name: "NVIDIA Corporation", 
    sector: "Semiconductors / AI", 
    price: 145.20, 
    priceChange: 3.5, 
    marketCap: 3250000000000, 
    peRatio: 65.2,
    cashReserves: 26000000000,
    receivables: 8000000000,
    inventory: 5000000000,
    fixedAssets: 6000000000,
    description: "Leader in visual computing and AI infrastructure.",
    earningsHistory: [
      { quarter: 'Q1 24', eps: 0.82 },
      { quarter: 'Q2 24', eps: 0.95 },
      { quarter: 'Q3 24', eps: 1.08 },
      { quarter: 'Q4 24', eps: 1.29 }
    ],
    revenueSegments: [
      { label: "Data Center", value: 45000000000 },
      { label: "Gaming", value: 12000000000 },
      { label: "Auto", value: 1500000000 },
      { label: "Vis. Pro", value: 1000000000 }
    ],
    suppliers: [
      { name: "ASML", type: "Equipment", contractValue: "Tier-1", summary: "EUV manufacturing tools.", status: 'Active', throughput: 3000000000 },
      { name: "TSM", type: "Foundry", contractValue: "Primary", summary: "GPU chip fabrication.", status: 'Bottlenecked', throughput: 8500000000 }
    ],
    customers: [
      { name: "MSFT", type: "Cloud", contractValue: "Strategic", summary: "Major H100 cluster buyer.", status: 'Active', throughput: 12000000000 },
      { name: "AMZN", type: "Cloud", contractValue: "Hyperscale", summary: "AWS Trainium partner.", status: 'Active', throughput: 4500000000 }
    ],
    news: [] 
  }
};
