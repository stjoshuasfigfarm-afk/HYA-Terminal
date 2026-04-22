'use client';

import React, { useEffect, useRef, useId } from 'react';

interface TerminalPriceChartProps {
  ticker: string;
}

declare global {
  interface Window {
    TradingView: any;
  }
}

/**
 * Institutional TradingView Chart Engine.
 * 
 * Provides high-fidelity HLOC visualization with stable ID management
 * and robust hydration guards to prevent parentNode errors.
 */
export default function TerminalPriceChart({ ticker }: TerminalPriceChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const containerId = `tv_chart_${reactId.replace(/:/g, '')}`;

  useEffect(() => {
    let isMounted = true;
    let script: HTMLScriptElement | null = null;

    const initWidget = () => {
      // Check if the container element exists in the DOM
      const el = document.getElementById(containerId);
      if (isMounted && window.TradingView && el) {
        let symbol = ticker;
        if (ticker === 'SPY') symbol = 'AMEX:SPY';
        else if (['AAPL', 'MSFT', 'NVDA', 'PLTR', 'GOOGL', 'AMZN', 'TSLA'].includes(ticker)) {
          symbol = `NASDAQ:${ticker}`;
        } else if (['V', 'MA', 'JPM', 'GS'].includes(ticker)) {
          symbol = `NYSE:${ticker}`;
        } else if (ticker === 'US10Y') symbol = 'TVC:US10Y';
        else if (ticker === 'US20Y') symbol = 'TVC:US20Y';
        else if (ticker === 'US30Y') symbol = 'TVC:US30Y';

        try {
          new window.TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1", 
            "locale": "en",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "container_id": containerId,
            "backgroundColor": "rgba(5, 5, 5, 1)",
            "gridColor": "rgba(38, 166, 154, 0.05)",
            "save_image": false,
            "details": false,
            "hotlist": false,
            "calendar": false,
            "show_popup_button": false,
            "overrides": {
              "mainSeriesProperties.candleStyle.upColor": "#26A69A",
              "mainSeriesProperties.candleStyle.downColor": "#ef5350",
              "mainSeriesProperties.candleStyle.drawWick": true,
              "mainSeriesProperties.candleStyle.drawBorder": true,
              "mainSeriesProperties.candleStyle.borderUpColor": "#26A69A",
              "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
              "mainSeriesProperties.candleStyle.wickUpColor": "#26A69A",
              "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350"
            }
          });
        } catch (e) {
          console.error("TradingView_Widget_Init_Crash:", e);
        }
      }
    };

    if (window.TradingView) {
      initWidget();
    } else {
      script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [ticker, containerId]);

  return (
    <div className="w-full h-full relative bg-[#050505] overflow-hidden flex flex-col">
      <div 
        id={containerId}
        ref={container} 
        className="flex-1 w-full h-full" 
      />
    </div>
  );
}
