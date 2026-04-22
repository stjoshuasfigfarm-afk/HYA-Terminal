import type { TickerData } from './types';

// Keywords that trigger a "Slowdown" alert
const SLOWDOWN_KEYWORDS = ["bottleneck", "shortage", "strike", "delay", "logistics"];

export function getRiskStatus(ticker: string, allData: Record<string, TickerData & { riskStatus?: string }>) {
  const company = allData[ticker];
  if (!company) {
    return "UNKNOWN";
  }

  const news = company.news || [];
  
  // 1. Check direct news for keywords
  const hasDirectRisk = news.some((article: TickerData['news'][number]) => 
    article.sentiment === "Bearish" && 
    article.title &&
    SLOWDOWN_KEYWORDS.some(word => article.title.toLowerCase().includes(word))
  );

  // 2. Check for upstream risk (Propagation)
  const upstreamRisk = company.suppliers?.some((s: TickerData['suppliers'][number]) => allData[s.name]?.riskStatus === "Warning");

  if (hasDirectRisk) return "🚨 CRITICAL: Direct Slowdown";
  if (upstreamRisk) return "⚠️ WARNING: Upstream Pressure";
  return "✅ STABLE";
}
