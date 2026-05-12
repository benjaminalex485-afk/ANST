import { eventBus } from '../../../events/event-bus';
import { FeedStatus } from '../types/feed-types';
import { NormalizedTick, Candle } from '../../../types/market';
import { useMarketStore } from '../../../store/market-store';
import { TimeAuthority } from '../../../services/time-authority';

import { useSettingsStore } from '../../../store/settings-store';

/**
 * Market Transport Infrastructure
 * Solely responsible for handling remote API data ingress.
 * Communicates with application strictly via the global event bus.
 */
export class MarketFeedService {
  private apiKey: string;
  private baseUrl = 'https://api.twelvedata.com';
  private activeSymbol = '';
  private activeTimeframe = '';

  constructor(apiKey?: string) {
    // Prioritize explicitly passed key, then settings store, fallback to runtime ENV.
    this.apiKey = apiKey || useSettingsStore.getState().twelveDataApiKey || import.meta.env.VITE_TWELVE_DATA_API_KEY || 'demo';
  }

  private logStatus(status: FeedStatus) {
    console.log(`[FeedService] PUBLISHING STATUS: ${status}`);
    eventBus.publish({
      metadata: { version: 1, eventId: crypto.randomUUID(), correlationId: 'feed_init', timestamp: TimeAuthority.now() },
      type: 'market:feed_status_changed',
      payload: { status }
    });
  }

  public async subscribeToSymbol(symbol: string, timeframe: string) {
    if (!symbol) {
      this.activeSymbol = '';
      if (this.tickInterval) clearInterval(this.tickInterval);
      this.logStatus(FeedStatus.DISCONNECTED);
      return;
    }

    this.activeSymbol = symbol;
    this.activeTimeframe = timeframe;
    
    // Hardened Cache Rule: Check existence before polling
    const hasCache = useMarketStore.getState().hasCachedData(symbol, timeframe);
    if (hasCache) {
      console.log(`[FeedService] Cache Hit for ${symbol} @ ${timeframe}. Immediately resuming stream.`);
      // 🚨 CRITICAL: Explicitly promote to STREAMING on cache hit, otherwise UI hangs on previous status!
      this.logStatus(FeedStatus.STREAMING);
      
      // Ensure simulated tail activity aligns to the most recent historical close cached
      const symKey = `${symbol}_${timeframe}`;
      const history = useMarketStore.getState().candles[symKey];
      this.startSimulatedTick(symbol, history?.[history.length - 1]?.close || 100);
      
      return;
    }

    this.logStatus(FeedStatus.HYDRATING);
    console.log(`[FeedService] Starting hydration for ${symbol} (${timeframe})...`);

    try {
      // Map generic timeframe tokens to Twelve Data contract expectations
      // Map generic timeframe tokens to Twelve Data contract expectations. 
      // Explicitly catch upper case '1M' before lowecasing!
      const mappedInterval = timeframe === '1M' ? '1month'
                            : timeframe.toLowerCase() === '1m' ? '1min' 
                            : timeframe.toLowerCase() === '5m' ? '5min' 
                            : timeframe.toLowerCase() === '15m' ? '15min' 
                            : timeframe.toLowerCase() === '30m' ? '30min' 
                            : timeframe.toLowerCase() === '1h' ? '1h' 
                            : timeframe.toLowerCase() === '4h' ? '4h' 
                            : timeframe.toLowerCase() === '1d' ? '1day' 
                            : timeframe.toLowerCase();

      let fetchSymbol = symbol;
      let exchangePart = '';
      
      // 🗺️ Global Exchange Mapping: Support 'TICKER:EXCHANGE' format (e.g., 'RELIANCE:NSE')
      if (symbol.includes(':')) {
        const pieces = symbol.split(':');
        fetchSymbol = pieces[0];
        exchangePart = `&exchange=${encodeURIComponent(pieces[1])}`;
      }

      const encodedSymbol = encodeURIComponent(fetchSymbol);
      const url = `${this.baseUrl}/time_series?symbol=${encodedSymbol}${exchangePart}&interval=${mappedInterval}&apikey=${this.apiKey}&outputsize=200`;
      
      const res = await fetch(url);
      console.log(`[FeedService] Response HTTP Status: ${res.status} ${res.statusText}`);
      
      const data = await res.json();
      console.log(`[FeedService] RAW DATA RECEIVED:`, JSON.stringify(data).substring(0, 200));

      if (data.status === 'error') {
        console.error('[FeedService] API Failure:', data.message);
        this.logStatus(FeedStatus.ERROR);
        return;
      }

      // Normalize vendor response into standard Candle contract with explicit UNIX numeric timestamps required for chart API
      const normalizedCandles: Candle[] = data.values.map((v: any) => {
        // Clean formatting to ensure native Date parsing reliability
        const parsedTime = new Date(v.datetime).getTime() / 1000; 
        
        return {
          time: parsedTime, // Number required for dynamic intraday timeframes
          open: parseFloat(v.open),
          high: parseFloat(v.high),
          low: parseFloat(v.low),
          close: parseFloat(v.close),
          volume: parseFloat(v.volume || '0'),
        };
      }).reverse(); // Ascending chronological order REQUIRED by TV

      // Dispatch Normalized Event strictly via partitioned Message Broker
      eventBus.publish({
        metadata: { version: 1, eventId: crypto.randomUUID(), correlationId: crypto.randomUUID(), timestamp: TimeAuthority.now() },
        type: 'market:candles_loaded',
        payload: {
          symbol,
          timeframe,
          candles: normalizedCandles
        }
      });

      this.logStatus(FeedStatus.STREAMING); // Promo to live context
      
      // NOTE: Realtime WebSocket implementation occurs here in subsequent refinement
      // For alpha, we generate a simulated tail event for testing stability
      this.startSimulatedTick(symbol, normalizedCandles[normalizedCandles.length -1]?.close || 100);

    } catch (err) {
      console.error('[FeedService] Network Failure:', err);
      this.logStatus(FeedStatus.ERROR);
    }
  }

  private tickInterval: any;
  private startSimulatedTick(symbol: string, lastPrice: number) {
    if (this.tickInterval) clearInterval(this.tickInterval);
    let currentPrice = lastPrice;

    this.tickInterval = setInterval(() => {
      if (symbol !== this.activeSymbol) return; // Context protection
      
      const change = (Math.random() - 0.5) * (currentPrice * 0.001);
      currentPrice += change;

      const tick: NormalizedTick = {
        symbol,
        price: currentPrice,
        timestamp: TimeAuthority.now(),
        volume: 100 + Math.random() * 100,
      };

      eventBus.publish({
        metadata: { version: 1, eventId: crypto.randomUUID(), correlationId: crypto.randomUUID(), timestamp: TimeAuthority.now() },
        type: 'market:tick',
        payload: tick
      });
    }, 1000);
  }

  public dispose() {
    if (this.tickInterval) clearInterval(this.tickInterval);
    this.logStatus(FeedStatus.DISCONNECTED);
  }
}
