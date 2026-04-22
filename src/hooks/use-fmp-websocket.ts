
"use client";

import { useState, useEffect, useRef } from 'react';

/**
 * Institutional FMP WebSocket Connector.
 * 
 * Leverages NEXT_PUBLIC prefix for client-side environmental access.
 * Securely decouples keys from the source code.
 */
export function useFmpWebsocket(
  ticker: string, 
  apiKey: string | undefined = process.env.NEXT_PUBLIC_FMP_API_KEY
) {
  const [livePrice, setLivePrice] = useState<{ price: number; symbol: string } | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Abort if environmental configuration is missing
    if (!ticker || !apiKey || apiKey === "") return;

    const socket = new WebSocket('wss://financialmodelingprep.com/ws/us-stocks');
    socketRef.current = socket;

    socket.onopen = () => {
      // Authenticate institutional node
      socket.send(JSON.stringify({ 
        event: "login", 
        data: { apiKey } 
      }));

      // Subscribe to target asset stream - FMP often expects uppercase but safe to send as provided
      socket.send(JSON.stringify({ 
        event: "subscribe", 
        data: { ticker: [ticker.toUpperCase()] } 
      }));
    };

    socket.onmessage = (event) => {
      try {
        const stockTick = JSON.parse(event.data);
        // Normalize symbol check to handle potential case variations from different streams
        if (stockTick && stockTick.s?.toUpperCase() === ticker.toUpperCase()) {
          setLivePrice({
            price: stockTick.ap || stockTick.p,
            symbol: stockTick.s
          });
        }
      } catch (e) {
        // Silent recovery for non-tick telemetry
      }
    };

    socket.onclose = () => {
      // Automatic socket recovery logic can be added here
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [ticker, apiKey]);

  return livePrice;
}
