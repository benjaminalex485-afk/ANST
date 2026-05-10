import React, { useState } from 'react';
import { useWatchlistStore } from '../stores/watchlist-store';
import { useMarketStore } from '../../../store/market-store';
import { Plus, X, Search } from 'lucide-react';
import { cn } from '../../../lib/utils';

export function WatchlistPanel() {
  const pinned = useWatchlistStore(state => state.pinnedSymbols);
  const addSymbol = useWatchlistStore(state => state.addSymbol);
  const removeSymbol = useWatchlistStore(state => state.removeSymbol);
  
  const activeSymbol = useMarketStore(state => state.activeSymbol);
  const dispatchMarket = useMarketStore(state => state.dispatch);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (sym: string) => {
    dispatchMarket({
      metadata: { version: 1, eventId: crypto.randomUUID(), correlationId: 'ui_interaction', timestamp: Date.now() },
      type: 'market:symbol_changed',
      payload: { symbol: sym }
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    addSymbol(searchQuery.trim().toUpperCase());
    setSearchQuery('');
  };

  return (
    <div className="h-full flex flex-col bg-panel border border-border rounded-sm overflow-hidden">
      {/* Header with mini search input */}
      <div className="shrink-0 px-3 py-2 border-b border-border bg-background/40">
        <form onSubmit={handleAdd} className="flex items-center gap-2 relative">
          <Search className="absolute left-2 w-3 h-3 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Add Ticker..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-sm pl-7 pr-2 py-1 font-mono text-[10px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-info/50"
          />
          <button type="submit" className="absolute right-1.5 hover:text-foreground text-muted-foreground">
            <Plus className="w-3 h-3" />
          </button>
        </form>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto p-1">
        {pinned.map((sym) => {
          const isActive = sym === activeSymbol;
          return (
            <div
              key={sym}
              className={cn(
                "group flex items-center justify-between px-2 py-2 rounded-sm cursor-pointer mb-0.5 transition-colors",
                isActive 
                  ? "bg-info/10 text-info border border-info/30" 
                  : "text-muted-foreground hover:bg-accent/50 border border-transparent"
              )}
              onClick={() => handleSelect(sym)}
            >
              <div className="flex flex-col gap-0.5">
                <span className={cn("font-mono text-[11px] font-bold", isActive ? "text-info" : "text-foreground")}>
                  {sym}
                </span>
                <span className="text-[8px] uppercase tracking-widest opacity-60">EQUITY</span>
              </div>

              <button
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSymbol(sym);
                }}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
