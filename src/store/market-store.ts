import { create } from 'zustand';
import { Candle, NormalizedTick } from '../types/market';
import { IEvent } from '../events/types';
import { FeedStatus } from '../workspaces/market/types/feed-types';
import { eventBus } from '../events/event-bus';

interface MarketState {
  activeSymbol: string;
  activeTimeframe: string;
  feedStatus: FeedStatus;
  candles: Record<string, Candle[]>; // Cache Bucket: symbol_timeframe
  latestTick: NormalizedTick | null;
  
  // Explicit Dispatch Handler
  dispatch: (event: IEvent) => void;
  
  // Cache-First Selectors
  hasCachedData: (symbol: string, timeframe: string) => boolean;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  activeSymbol: '',
  activeTimeframe: '1m',
  feedStatus: FeedStatus.DISCONNECTED,
  candles: {},
  latestTick: null,

  hasCachedData: (symbol, timeframe) => {
    const key = `${symbol}_${timeframe}`;
    const bucket = get().candles[key];
    return !!(bucket && bucket.length > 0);
  },

  dispatch: (event: IEvent) => {
    switch (event.type) {
      case 'market:symbol_changed':
        set({ activeSymbol: event.payload.symbol, latestTick: null });
        break;
      case 'market:timeframe_changed':
        set({ activeTimeframe: event.payload.timeframe });
        break;
      case 'market:feed_status_changed':
        set({ feedStatus: event.payload.status });
        break;
      case 'market:tick': {
        const tick = event.payload as NormalizedTick;
        set((state) => {
          if (tick.symbol !== state.activeSymbol) return state;
          return { latestTick: tick };
        });
        break;
      }
      case 'market:candles_loaded': {
        const { symbol, timeframe, candles } = event.payload;
        const key = `${symbol}_${timeframe}`;
        set((state) => ({
          candles: { ...state.candles, [key]: candles },
        }));
        break;
      }
      case 'market:candle_update': {
        const { symbol, timeframe, candle } = event.payload;
        const key = `${symbol}_${timeframe}`;
        set((state) => {
          const symCandles = state.candles[key] ? [...state.candles[key]] : [];
          if (symCandles.length > 0 && symCandles[symCandles.length - 1].time === candle.time) {
            symCandles[symCandles.length - 1] = candle; // Overwrite last formed
          } else {
            symCandles.push(candle);
            if (symCandles.length > 1000) symCandles.shift(); // Cap cache size for stability
          }
          return {
            candles: { ...state.candles, [key]: symCandles },
          };
        });
        break;
      }
    }
  },
}));

// ⚡️ Secure Autonomous Domain Binding
// Binds store explicitly outside the React runtime node lifecycle, ensuring exactly-once routing invariant.
eventBus.subscribe('market:*', (event) => useMarketStore.getState().dispatch(event), 'store:market');
