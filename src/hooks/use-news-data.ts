
"use client";

import { useState, useEffect } from 'react';
import { fetchNewsAction } from '@/app/actions';
import type { LogEntry, TickerData } from '@/lib/types';

interface NewsDataOptions {
  addLog: (type: LogEntry['type'], message: string) => void;
  enableRealTime: boolean;
  apiStatus: { 
      finnhub: boolean | null;
      alphaVantage: boolean | null;
      financialModelingPrep: boolean | null;
      marketStack: boolean | null;
  };
}

export function useNewsData(ticker: string, { addLog, enableRealTime, apiStatus }: NewsDataOptions) {
  const [news, setNews] = useState<TickerData['news']>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const hasValidKey = apiStatus.alphaVantage === true || apiStatus.finnhub === true || apiStatus.financialModelingPrep === true || apiStatus.marketStack === true;
      if (!ticker || !enableRealTime || !hasValidKey) {
        setNews([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      addLog('AI_QUERY', `FETCHING_NEWS_AND_ANALYZING_SENTIMENT for ${ticker}`);
      try {
        const result = await fetchNewsAction(ticker);
        
        if (result && result.length > 0) {
          setNews(result);
          setError(null);
          addLog('AI_RESPONSE', `NEWS_FETCH_SUCCESS for ${ticker}: ${result.length} articles analyzed`);
        } else {
          setNews([]);
          setError(`No news found for ${ticker}.`);
          addLog('INFO', `NO_NEWS_FOUND for ${ticker}`);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch and analyze news data.');
        addLog('FS_ERR', `NEWS_ANALYSIS_FAILED: ${err.message}`);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [ticker, addLog, enableRealTime, apiStatus.finnhub, apiStatus.alphaVantage, apiStatus.financialModelingPrep, apiStatus.marketStack]);

  return { news, loading, error };
}
