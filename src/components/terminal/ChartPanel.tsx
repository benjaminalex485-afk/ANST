import { Maximize2, Settings2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TerminalPanel } from './TerminalPanel';
import { useMarketStore } from '../../store/market-store';

const tools = ['Crosshair', 'Trend', 'Fib', 'Measure'];
const indicators = ['EMA(20)', 'EMA(50)', 'VWAP', 'RSI', 'MACD', 'BBands'];

import { LightweightChart } from '../../workspaces/market/components/LightweightChart';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { eventBus } from '../../events/event-bus';
import { TimeAuthority } from '../../services/time-authority';
import { useWatchlistStore } from '../../workspaces/market/stores/watchlist-store';

export function ChartPanel() {
  const activeSymbol = useMarketStore((state) => state.activeSymbol);
  const activeTimeframe = useMarketStore((state) => state.activeTimeframe);
  const pinnedSymbols = useWatchlistStore((state) => state.pinnedSymbols);

  const handleSymbolSwitch = (symbol: string) => {
    if (symbol === activeSymbol) return;
    
    eventBus.publish({
      metadata: { version: 1, eventId: crypto.randomUUID(), correlationId: 'dashboard_watchlist_switch', timestamp: TimeAuthority.now() },
      type: 'market:symbol_changed',
      payload: { symbol }
    });
  };

  return (
    <TerminalPanel
      title={activeSymbol ? `${activeSymbol} · ${activeTimeframe}` : 'Market Visualizer'}
      subtitle="LIVE FEED · SPOT"
      actions={
        <div className="flex items-center gap-1">
          <button className="rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Settings2 className="h-3 w-3" />
          </button>
          <button className="rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Maximize2 className="h-3 w-3" />
          </button>
        </div>
      }
      className="h-full min-h-[300px]"
    >
      <div className="flex h-full w-full flex-col select-none min-h-0">
        {/* Watchlist Quick Ribbon */}
        <div className="flex items-center gap-2 border-b border-border px-2.5 py-1 shrink-0 overflow-x-auto no-scrollbar">
          {pinnedSymbols.length === 0 ? (
            <span className="font-mono text-[9px] text-muted-foreground italic py-0.5">
              Add assets in Market Tab to populate dashboard selector.
            </span>
          ) : (
            <div className="flex items-center gap-1">
              {pinnedSymbols.map((sym) => {
                const isActive = sym === activeSymbol;
                return (
                  <button
                    key={sym}
                    onClick={() => handleSymbolSwitch(sym)}
                    className={cn(
                      "px-2 py-0.5 font-mono text-[9px] font-bold rounded-sm border transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary border-primary/40 shadow-[0_0_8px_rgba(59,130,246,0.1)]" 
                        : "bg-background border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          )}

          <div className="ml-auto flex items-center gap-1 shrink-0">
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm bg-accent text-foreground">RSI</span>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm border border-border text-muted-foreground">EMA</span>
          </div>
        </div>

        {/* Unified Passive Canvas */}
        <div className="relative flex-1 min-h-0 overflow-hidden bg-background flex flex-col">
          <LightweightChart />
        </div>
      </div>
    </TerminalPanel>
  );
}
export default ChartPanel;
