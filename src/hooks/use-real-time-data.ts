
"use client";

import { useState, useEffect, useRef } from 'react';
import { fetchRealTimeDataAction } from '@/app/actions';

export interface RealTimeData {
  price: number;
  delta: number;
  volume: number;
}

export function useRealTimeData(
  ticker: string, 
  options: { 
    enableRealTime: boolean; 
    apiStatus: {
        finnhub: boolean | null;
        alphaVantage: boolean | null;
        financialModelingPrep: boolean | null;
    }; 
    updateInterval?: number; 
  }
) {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const clearPolling = () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchRealTimeDataAction(ticker);
        
        if (result) {
            setData({
              price: result.price,
              delta: result.delta,
              volume: result.volume ?? 0,
            });
            setLastUpdated(new Date());
            setError(null);
        } else {
            setError('DATA_NULL: API_LIMIT_OR_EMPTY_RESPONSE');
            setData(null);
        }
      } catch (err: any) {
        setError(err.message || 'NET_ERROR: FETCH_FAILED');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    clearPolling();

    const hasValidKey = options.apiStatus.alphaVantage === true || options.apiStatus.finnhub === true || options.apiStatus.financialModelingPrep === true;

    if (options.enableRealTime && hasValidKey && ticker) {
      fetchData(); // Initial execution
      const updateInterval = options.updateInterval || 15000;
      intervalIdRef.current = setInterval(fetchData, updateInterval);
    } else {
      setData(null);
      setError(null);
      setLoading(false);
    }

    return () => clearPolling();
  }, [ticker, options.enableRealTime, options.apiStatus.finnhub, options.apiStatus.alphaVantage, options.apiStatus.financialModelingPrep, options.updateInterval]);

  return { 
    data, 
    loading, 
    error,
    lastUpdated 
  };
}
