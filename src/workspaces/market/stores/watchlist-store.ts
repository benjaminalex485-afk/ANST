import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistState {
  pinnedSymbols: string[];
  addSymbol: (symbol: string) => void;
  removeSymbol: (symbol: string) => void;
}

/**
 * Watchlist Inventory Hub
 * Governs symbol persistence for quick selection switching.
 */
export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      pinnedSymbols: ['AAPL', 'TSLA', 'NVDA', 'SPY', 'MSFT', 'QQQ', 'AMD', 'META'],
      
      addSymbol: (symbol) => set((state) => {
        const upper = symbol.toUpperCase();
        if (state.pinnedSymbols.includes(upper)) return state;
        return { pinnedSymbols: [...state.pinnedSymbols, upper] };
      }),
      
      removeSymbol: (symbol) => set((state) => ({
        pinnedSymbols: state.pinnedSymbols.filter(s => s !== symbol.toUpperCase())
      })),
    }),
    {
      name: 'anst-watchlist-storage', // Auto persist to localstorage
    }
  )
);
