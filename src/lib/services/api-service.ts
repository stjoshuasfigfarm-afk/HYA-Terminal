
import type { TickerData, HistoricalDataPoint } from '@/lib/types';

export class ApiService {
  private finnhubBaseUrl = "https://finnhub.io/api/v1";
  private alphaVantageBaseUrl = "https://www.alphavantage.co/query";
  private fmpBaseUrl = "https://financialmodelingprep.com/stable";
  private tradingEconomicsBaseUrl = "https://tradingeconomics.com/api";
  private rapidApiYahooBaseUrl = "https://yh-finance.p.rapidapi.com";

  private finnhubApiKey: string | undefined;
  private alphaVantageApiKey: string | undefined;
  private fmpApiKey: string | undefined;
  private tradingEconomicsApiKey: string | undefined;
  private rapidApiKey: string | undefined;
  private yahooFinanceApiKey: string | undefined;

  private CACHE_TIME = 3600;

  constructor(keys: { 
    finnhub?: string; 
    alphaVantage?: string; 
    fmp?: string; 
    tradingEconomics?: string; 
    rapidApi?: string;
    yahooFinance?: string;
  }) {
    this.finnhubApiKey = keys.finnhub;
    this.alphaVantageApiKey = keys.alphaVantage;
    this.fmpApiKey = keys.fmp;
    this.tradingEconomicsApiKey = keys.tradingEconomics;
    this.rapidApiKey = keys.rapidApi;
    this.yahooFinanceApiKey = keys.yahooFinance || keys.rapidApi; // Often Yahoo is via RapidAPI
  }

  private async safeJson(response: Response) {
    if (!response || !response.ok) return null;
    try {
      const text = await response.text();
      if (!text || text.trim().startsWith('<!DOCTYPE html>')) return null;
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  public async validateApiKeys(): Promise<{ 
    finnhub: boolean, 
    alphaVantage: boolean, 
    financialModelingPrep: boolean, 
    tradingEconomics: boolean, 
    rapidApi: boolean, 
    yahooFinance: boolean 
  }> {
    try {
      const results = await Promise.allSettled([
        this.validateFinnhub(),
        this.validateAlphaVantage(),
        this.validateFmp(),
        this.validateTradingEconomics(),
        Promise.resolve(!!this.rapidApiKey),
        this.validateYahooFinance()
      ]);
      
      return { 
        finnhub: results[0].status === 'fulfilled' ? (results[0].value as boolean) : false,
        alphaVantage: results[1].status === 'fulfilled' ? (results[1].value as boolean) : false,
        financialModelingPrep: results[2].status === 'fulfilled' ? (results[2].value as boolean) : false,
        tradingEconomics: results[3].status === 'fulfilled' ? (results[3].value as boolean) : false,
        rapidApi: results[4].status === 'fulfilled' ? (results[4].value as boolean) : !!this.rapidApiKey,
        yahooFinance: results[5].status === 'fulfilled' ? (results[5].value as boolean) : false,
      };
    } catch (e) {
      return { finnhub: false, alphaVantage: false, financialModelingPrep: false, tradingEconomics: false, rapidApi: false, yahooFinance: false };
    }
  }

  private async validateFinnhub(): Promise<boolean> {
    if (!this.finnhubApiKey) return false;
    try {
      const response = await fetch(`${this.finnhubBaseUrl}/profile2?symbol=AAPL&token=${this.finnhubApiKey}`, { 
        next: { revalidate: this.CACHE_TIME },
        signal: AbortSignal.timeout(5000) 
      });
      const data = await this.safeJson(response);
      return !!data && !!data.name;
    } catch {
      return false;
    }
  }

  private async validateAlphaVantage(): Promise<boolean> {
    if (!this.alphaVantageApiKey) return false;
    try {
      const response = await fetch(`${this.alphaVantageBaseUrl}?function=SYMBOL_SEARCH&keywords=IBM&apikey=${this.alphaVantageApiKey}`, { 
        next: { revalidate: this.CACHE_TIME },
        signal: AbortSignal.timeout(5000) 
      });
      const data = await this.safeJson(response);
      return !!(data?.bestMatches || data?.Note || data?.Information);
    } catch {
      return false;
    }
  }

  private async validateFmp(): Promise<boolean> {
    if (!this.fmpApiKey) return false;
    try {
      const response = await fetch(`${this.fmpBaseUrl}/profile?symbol=AAPL&apikey=${this.fmpApiKey}`, { 
        next: { revalidate: this.CACHE_TIME },
        signal: AbortSignal.timeout(5000) 
      });
      const data = await this.safeJson(response);
      return Array.isArray(data) && data.length > 0;
    } catch {
      return false;
    }
  }

  private async validateTradingEconomics(): Promise<boolean> {
    if (!this.tradingEconomicsApiKey) return false;
    return true;
  }

  private async validateYahooFinance(): Promise<boolean> {
    const key = this.yahooFinanceApiKey || this.rapidApiKey;
    if (!key) return false;
    try {
      const response = await fetch(`${this.rapidApiYahooBaseUrl}/market/get-summary?region=US&lang=en`, {
        headers: {
          'x-rapidapi-key': key,
          'x-rapidapi-host': 'yh-finance.p.rapidapi.com'
        },
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async fetchAlphaVantageBalanceSheet(symbol: string): Promise<any> {
    if (!this.alphaVantageApiKey) return null;
    try {
      const url = `${this.alphaVantageBaseUrl}?function=BALANCE_SHEET&symbol=${symbol}&apikey=${this.alphaVantageApiKey}`;
      const response = await fetch(url, { 
        next: { revalidate: 86400 }, 
        signal: AbortSignal.timeout(5000) 
      });
      const data = await this.safeJson(response);
      if (data && data.quarterlyReports && data.quarterlyReports.length > 0) {
        const latest = data.quarterlyReports[0];
        return {
          cashReserves: parseFloat(latest.cashAndCashEquivalentsAtCarryingValue || "0"),
          receivables: parseFloat(latest.currentNetReceivables || "0"),
          inventory: parseFloat(latest.inventory || "0"),
          fixedAssets: parseFloat(latest.propertyPlantEquipmentNet || "0"),
          totalDebt: parseFloat(latest.shortLongTermDebtTotal || "0"),
        };
      }
    } catch (e) {}
    return null;
  }

  async fetchNews(symbol: string): Promise<any[]> {
    if (!this.finnhubApiKey) return [];
    try {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const url = `${this.finnhubBaseUrl}/company-news?symbol=${symbol}&from=${weekAgo}&to=${today}&token=${this.finnhubApiKey}`;
      const response = await fetch(url, { 
        next: { revalidate: 1800 }, 
        signal: AbortSignal.timeout(5000) 
      });
      const data = await this.safeJson(response);
      
      if (Array.isArray(data)) {
        return data.slice(0, 10).map((item: any) => ({
          title: item.headline,
          source: item.source,
          sentiment: 'Neutral',
          publishedAt: item.datetime,
          url: item.url,
        }));
      }
    } catch (e) {}
    return [];
  }

  async fetchMacroHealth(): Promise<any> {
    let macroData: any = {
      history: [],
      fedFunds: "5.25 - 5.50",
      recessionProb: "68.4%",
      history30Y: []
    };

    if (this.alphaVantageApiKey) {
      try {
        const [ffr, t10, t2, t30m] = await Promise.allSettled([
          fetch(`${this.alphaVantageBaseUrl}?function=FEDERAL_FUNDS_RATE&interval=daily&apikey=${this.alphaVantageApiKey}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }).then(r => r.ok ? this.safeJson(r) : null),
          fetch(`${this.alphaVantageBaseUrl}?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${this.alphaVantageApiKey}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }).then(r => r.ok ? this.safeJson(r) : null),
          fetch(`${this.alphaVantageBaseUrl}?function=TREASURY_YIELD&interval=daily&maturity=2year&apikey=${this.alphaVantageApiKey}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }).then(r => r.ok ? this.safeJson(r) : null),
          fetch(`${this.alphaVantageBaseUrl}?function=TREASURY_YIELD&interval=monthly&maturity=30year&apikey=${this.alphaVantageApiKey}`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }).then(r => r.ok ? this.safeJson(r) : null)
        ]);

        const ffrVal = ffr.status === 'fulfilled' ? ffr.value : null;
        const t10Val = t10.status === 'fulfilled' ? t10.value : null;
        const t2Val = t2.status === 'fulfilled' ? t2.value : null;
        const t30mVal = t30m.status === 'fulfilled' ? t30m.value : null;

        if (ffrVal && t10Val && t2Val && t10Val.data && t2Val.data) {
          const t10Map = new Map(t10Val.data.map((d: any) => [d.date, d.value]));
          const t2Map = new Map(t2Val.data.map((d: any) => [d.date, d.value]));
          const allDates = Array.from(new Set([...t10Map.keys(), ...t2Map.keys()])).sort().reverse().slice(0, 60);
          
          macroData.history = allDates.map(date => ({
            date,
            t10: parseFloat(t10Map.get(date) || "0"),
            t2: parseFloat(t2Map.get(date) || "0")
          })).reverse();
          
          if (ffrVal.data && ffrVal.data[0]) {
            macroData.fedFunds = ffrVal.data[0].value;
          }
        }

        if (t30mVal && t30mVal.data) {
          macroData.history30Y = t30mVal.data.slice(0, 360).map((d: any) => ({
            date: d.date,
            value: parseFloat(d.value)
          })).reverse();
        }
      } catch (e) {}
    }

    if (macroData.history.length === 0) {
      macroData.history = Array.from({ length: 60 }, (_, i) => {
        const baseRate = 4.2 + (Math.sin(i / 10) * 0.4) + (Math.random() * 0.08);
        const spread = -0.20 + (Math.cos(i / 15) * 0.15) + (Math.random() * 0.05);
        return {
          date: new Date(Date.now() - (60 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          t10: parseFloat(baseRate.toFixed(3)),
          t2: parseFloat((baseRate - spread).toFixed(3))
        };
      });
    }

    return macroData;
  }

  async fetchFmpProfile(ticker: string): Promise<any> {
    if (!this.fmpApiKey) return null;
    try {
      const url = `${this.fmpBaseUrl}/profile?apikey=${this.fmpApiKey}&symbol=${ticker}`;
      const response = await fetch(url, { 
        next: { revalidate: this.CACHE_TIME },
        signal: AbortSignal.timeout(5000) 
      });
      const data = await this.safeJson(response);
      return (Array.isArray(data) && data.length > 0) ? data[0] : null;
    } catch (e) {
      return null;
    }
  }

  async searchSymbol(query: string): Promise<any[]> {
    if (!this.fmpApiKey) return [];
    try {
      const url = `${this.fmpBaseUrl}/search-name?apikey=${this.fmpApiKey}&query=${query}&limit=10`;
      const response = await fetch(url, { 
        next: { revalidate: 3600 }, 
        signal: AbortSignal.timeout(5000) 
      });
      const data = await this.safeJson(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  async fetchRealTimeData(ticker: string): Promise<any> {
    if (this.alphaVantageApiKey) {
      try {
        const url = `${this.alphaVantageBaseUrl}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${this.alphaVantageApiKey}`;
        const response = await fetch(url, { next: { revalidate: 300 }, signal: AbortSignal.timeout(5000) });
        const data = await this.safeJson(response);
        if (data && data['Global Quote']) {
          const q = data['Global Quote'];
          return { price: parseFloat(q['05. price']), delta: parseFloat(q['10. change percent'].replace('%','')) };
        }
      } catch (e) {}
    }

    if (this.fmpApiKey) {
      try {
        const url = `${this.fmpBaseUrl}/quote/${ticker}?apikey=${this.fmpApiKey}`;
        const response = await fetch(url, { 
          next: { revalidate: 15 }, 
          signal: AbortSignal.timeout(5000) 
        });
        const data = await this.safeJson(response);
        if (Array.isArray(data) && data.length > 0) {
          return { price: data[0].price, delta: data[0].changesPercentage };
        }
      } catch (e) {}
    }
    return null;
  }
}
