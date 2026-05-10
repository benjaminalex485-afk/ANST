import { create } from 'zustand';
import { Candle, NormalizedTick } from '../types/market';
import { IEvent } from '../events/types';

interface MarketState {
  activeSymbol: string;
  activeTimeframe: string;
  candles: Record<string, Candle[]>;
  latestTick: NormalizedTick | null;
  dispatch: (event: IEvent) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  activeSymbol: 'BTC/USD',
  activeTimeframe: '1m',
  candles: {},
  latestTick: null,

  dispatch: (event: IEvent) => {
    switch (event.type) {
      case 'market:symbol_changed':
        set({ activeSymbol: event.payload.symbol, latestTick: null });
        break;
      case 'market:timeframe_changed':
        set({ activeTimeframe: event.payload.timeframe });
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
        const { symbol, candles } = event.payload;
        set((state) => ({
          candles: { ...state.candles, [symbol]: candles },
        }));
        break;
      }
      case 'market:candle_update': {
        const { symbol, candle } = event.payload;
        set((state) => {
          const symCandles = state.candles[symbol] ? [...state.candles[symbol]] : [];
          if (symCandles.length > 0 && symCandles[symCandles.length - 1].time === candle.time) {
            symCandles[symCandles.length - 1] = candle; // update last
          } else {
            symCandles.push(candle); // append new
            if (symCandles.length > 100) symCandles.shift(); // circular
          }
          return {
            candles: { ...state.candles, [symbol]: symCandles },
          };
        });
        break;
      }
    }
  },
}));
