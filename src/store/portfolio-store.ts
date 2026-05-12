import { create } from 'zustand';
import { Position, Order, PortfolioSummary } from '../types/portfolio';
import { IEvent } from '../events/types';
import { eventBus } from '../events/event-bus';

interface PortfolioState {
  summary: PortfolioSummary;
  positions: Position[];
  orders: Order[];
  dispatch: (event: IEvent) => void;
  adjustCash: (amount: number) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  summary: {
    netAssetValue: 0,
    cashBalance: 0,
    totalUnrealizedPnL: 0,
    totalRealizedPnL: 0,
  },
  positions: [],
  orders: [],

  dispatch: (event: IEvent) => {
    switch (event.type) {
      case 'portfolio:summary_updated':
        set({ summary: event.payload });
        break;
      case 'portfolio:positions_updated':
        set({ positions: event.payload });
        break;
      case 'portfolio:order_added':
        set((state) => ({ orders: [event.payload, ...state.orders].slice(0, 50) }));
        break;
      case 'portfolio:orders_updated':
        set({ orders: event.payload });
        break;
      case 'portfolio:reset':
        const initialCash = event.payload?.initialCash || 0;
        set({
          summary: {
            netAssetValue: initialCash,
            cashBalance: initialCash,
            totalUnrealizedPnL: 0,
            totalRealizedPnL: 0,
          },
          positions: [],
          orders: [],
        });
        break;
    }
  },

  adjustCash: (amount: number) => {
    set((state) => {
      const newCash = Math.max(0, state.summary.cashBalance + amount);
      // Recalc NAV (Cash + sum of unrealized/realized/position values usually, but keep it simple for now)
      return {
        summary: {
          ...state.summary,
          cashBalance: newCash,
          netAssetValue: state.summary.netAssetValue + amount // Simple scalar adjustment
        }
      };
    });
  }
}));

eventBus.subscribe('portfolio:*', (event) => usePortfolioStore.getState().dispatch(event), 'store:portfolio');
