# Cache-First Data Refactor: Design Document

## 1. Overview
The current data fetching layer in `src/app/actions.ts` fetches data directly from external APIs (Finnhub, FMP, AlphaVantage) on every request. This violates the core project mandate of "Silo Resilience" and increases costs/latency. This refactor implements a **Firestore-caching layer** (Phase D) between the external APIs (Phase C) and the UI (Phase E).

## 2. Architectural Design
- **Read Logic:** When a fetch request comes in:
  1. Check Firestore for a document matching the ticker symbol: `tickers/{symbol}`.
  2. If the document exists AND `updatedAt` is within the threshold (e.g., 1 hour), return the cached document.
  3. If missing or stale, trigger the API fetch (Phase C).
  4. Once fetched, update/create the Firestore document (Phase D) and return the data.

## 3. Implementation Steps for Roo Code

### Step A: Update `ApiService` (lib/services/api-service.ts)
No changes required here; it remains our raw data provider.

### Step B: Create Firestore Helper (src/firebase/firestore/cache.ts)
- Create a helper to `getCachedTickerData(symbol: string)` and `setCachedTickerData(symbol: string, data: TickerData)`.
- Use the standard Firebase Firestore Web SDK.

### Step C: Refactor `getFullTickerDataAction` (src/app/actions.ts)
- Update the action to:
  ```typescript
  export async function getFullTickerDataAction(symbol: string) {
    // 1. Try getCachedTickerData(symbol)
    // 2. If valid, return { data: cachedData, status: "CACHE_HIT" }
    // 3. Otherwise, perform original Promise.all API calls
    // 4. Then await setCachedTickerData(symbol, harvestedData)
    // 5. Return { data: harvestedData, status: "HARVEST_COMPLETE" }
  }
  ```

## 4. Operational Mandates
- **Visual Feedback:** All cached reads should log `FS_READ` and fresh fetches should log `FS_SYNC` to the log entries state (visible in the UI).
- **Graceful Degradation:** If Firestore is inaccessible, the action MUST fall back to the raw API fetch without crashing.
- **Consistency:** Ensure the `TickerData` type remains strictly consistent with the cached schema.
