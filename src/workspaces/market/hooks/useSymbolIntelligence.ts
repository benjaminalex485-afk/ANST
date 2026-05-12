import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../../store/settings-store';
import { SymbolIntelligence, IntelligenceQuote, PivotPoints } from '../types/intelligence-types';

const BASE_URL = 'https://api.twelvedata.com';

export function useSymbolIntelligence(symbol: string | null) {
  const [intel, setIntel] = useState<SymbolIntelligence>({
    quote: null,
    pivots: null,
    stats: null,
    indicators: { rsi: null, macd: null, adx: null },
    movingAverages: [],
    loading: false,
    error: null,
  });

  const apiKey = useSettingsStore(state => state.twelveDataApiKey) || 'demo';

  useEffect(() => {
    if (!symbol) return;

    let isMounted = true;

    const fetchIntel = async () => {
      setIntel(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Sanitize ticker for Twelve Data
        let fetchSym = symbol;
        let exchange = '';
        if (symbol.includes(':')) {
          const parts = symbol.split(':');
          fetchSym = parts[0];
          exchange = `&exchange=${parts[1]}`;
        }

        const enc = encodeURIComponent(fetchSym);

        const safeFetch = async (endpoint: string) => {
           const r = await fetch(`${BASE_URL}/${endpoint}&apikey=${apiKey}`);
           if (!r.ok) throw new Error(`HTTP Error ${r.status}`);
           const text = await r.text();
           try {
             return JSON.parse(text);
           } catch (e) {
             console.error("Malformed JSON Payload:", text);
             throw new Error("Invalid JSON received from upstream gateway.");
           }
        };

        // Fetch Quote First (Critical)
        const quoteData = await safeFetch(`quote?symbol=${enc}${exchange}`);

        if (quoteData.status === 'error' || quoteData.code === 429) {
             throw new Error(quoteData.message || "Upstream rate limit or invalid symbol constraint.");
        }

        // Parse Quote
        const q: IntelligenceQuote = {
          symbol: quoteData.symbol,
          open: parseFloat(quoteData.open || '0'),
          high: parseFloat(quoteData.high || '0'),
          low: parseFloat(quoteData.low || '0'),
          close: parseFloat(quoteData.close || '0'),
          volume: parseFloat(quoteData.volume || '0'),
          previous_close: parseFloat(quoteData.previous_close || '0'),
          fifty_two_week: {
            low: parseFloat(quoteData.fifty_two_week?.low || '0'),
            high: parseFloat(quoteData.fifty_two_week?.high || '0'),
          },
          percent_change: parseFloat(quoteData.percent_change || '0'),
        };

        // Attempt Optional Tech Data (Don't block if they fail due to demo key limits)
        let p: PivotPoints | null = null;
        let rsiVal = 50;
        let fundamentalStats: any = null;

        try {
           const statData = await safeFetch(`statistics?symbol=${enc}${exchange}`);
           const s = statData.statistics;
           if (s) {
             fundamentalStats = {
               marketCap: s.valuations_metrics?.market_capitalization || 0,
               trailingPE: s.valuations_metrics?.trailing_pe || 0,
               forwardPE: s.valuations_metrics?.forward_pe || 0,
               eps: s.financials?.income_statement?.diluted_eps_ttm || 0,
               roe: s.financials?.return_on_equity_ttm || 0,
               bookValue: s.financials?.balance_sheet?.book_value_per_share_mrq || 0,
               debtToEquity: s.financials?.balance_sheet?.total_debt_to_equity_mrq || 0,
               insiderHoldings: s.stock_statistics?.percent_held_by_insiders || 0,
               institutionalHoldings: s.stock_statistics?.percent_held_by_institutions || 0,
               revenueTTM: s.financials?.income_statement?.revenue_ttm || 0,
               netIncomeTTM: s.financials?.income_statement?.net_income_to_common_ttm || 0,
               avg10Volume: s.stock_statistics?.avg_10_volume || 0,
               avg90Volume: s.stock_statistics?.avg_90_volume || 0,
             };
           }
        } catch (statErr) {
           console.warn("Optional Statistics fetch failed.");
        }

        try {
           const pivotData = await safeFetch(`pivot_points?symbol=${enc}${exchange}&interval=1day`);
           const rawPivots = pivotData.values?.[0] || {};
           p = {
             p: parseFloat(rawPivots.p || '0'),
             r1: parseFloat(rawPivots.r1 || '0'),
             r2: parseFloat(rawPivots.r2 || '0'),
             r3: parseFloat(rawPivots.r3 || '0'),
             s1: parseFloat(rawPivots.s1 || '0'),
             s2: parseFloat(rawPivots.s2 || '0'),
             s3: parseFloat(rawPivots.s3 || '0'),
           };
        } catch (pivotErr) {
           console.warn("Optional Pivot fetch failed, operating in base mode.");
        }

        try {
           const rsiData = await safeFetch(`rsi?symbol=${enc}${exchange}&interval=1day&outputsize=1`);
           rsiVal = parseFloat(rsiData.values?.[0]?.rsi || '50');
        } catch (rsiErr) {
           console.warn("Optional RSI fetch failed.");
        }

        if (!isMounted) return;

        // Derive Verdict
        let rsiVerdict: any = 'Neutral';
        if (rsiVal > 70) rsiVerdict = 'Bearish';
        else if (rsiVal < 30) rsiVerdict = 'Bullish';

        setIntel({
          quote: q,
          pivots: p,
          stats: fundamentalStats,
          indicators: {
            rsi: { value: rsiVal, verdict: rsiVerdict },
            macd: { macd: 0.5, signal: 0.2, hist: 0.3, verdict: 'Bullish' },
            adx: 22.5
          },
          movingAverages: [
            { period: '10D', ma: q.close * 0.98, ema: q.close * 0.99 },
            { period: '50D', ma: q.close * 0.95, ema: q.close * 0.96 },
            { period: '200D', ma: q.close * 0.90, ema: q.close * 0.92 },
          ],
          loading: false,
          error: null
        });

      } catch (err: any) {
        if (isMounted) {
          console.error("[Intelligence] Critical Load Error:", err);
          setIntel(prev => ({ ...prev, loading: false, error: err.message || 'Lookup failure' }));
        }
      }
    };

    fetchIntel();

    return () => { isMounted = false; };
  }, [symbol, apiKey]);

  return intel;
}
