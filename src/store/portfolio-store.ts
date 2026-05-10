import { create } from 'zustand';
import { Position, Order, PortfolioSummary } from '../types/portfolio';
import { IEvent } from '../events/types';
import { eventBus } from '../events/event-bus';

interface PortfolioState {
  summary: PortfolioSummary;
  positions: Position[];
  orders: Order[];
  dispatch: (event: IEvent) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  summary: {
    netAssetValue: 1000000,
    cashBalance: 1000000,
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
        set({
          summary: {
            netAssetValue: 1000000,
            cashBalance: 1000000,
            totalUnrealizedPnL: 0,
            totalRealizedPnL: 0,
          },
          positions: [],
          orders: [],
        });
        break;
    }
  },
}));

eventBus.subscribe('portfolio:*', (event) => usePortfolioStore.getState().dispatch(event));
