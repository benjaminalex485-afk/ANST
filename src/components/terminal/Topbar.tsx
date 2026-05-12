import { Bell, Command, Search, User, Wifi, Zap } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { StatusBadge } from './StatusBadge';
import { useMarketStore } from '../../store/market-store';
import { useHealthStore } from '../../store/health-store';
import { useUIStore } from '../../store/ui-store';
import { eventBus } from '../../events/event-bus';
import { TimeAuthority } from '../../services/time-authority';
import { useRuntimeStore } from '../../store/runtime-store';
import { useWatchlistStore } from '../../workspaces/market/stores/watchlist-store';
import { AccountPortal } from './AccountPortal';

// Dynamic: Pulls directly from Watchlist context now.
const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1D', '1M'];

export function Topbar() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const pinnedSymbols = useWatchlistStore((state) => state.pinnedSymbols);
  const activeSymbol = useMarketStore((state) => state.activeSymbol);
  const activeTimeframe = useMarketStore((state) => state.activeTimeframe);
  const latestTick = useMarketStore((state) => state.latestTick);
  const health = useHealthStore((state) => state.health);
  const uiDispatch = useUIStore((state) => state.dispatch);
  
  const runtimeMode = useRuntimeStore((state) => state.mode);
  const runtimeState = useRuntimeStore((state) => state.state);

  const handleSymbolChange = (symbol: string) => {
    if (!symbol) return;
    eventBus.publish({
      metadata: {
        version: 1,
        eventId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
        timestamp: TimeAuthority.now(),
      },
      type: 'market:symbol_changed',
      payload: { symbol },
    });
  };

  const handleTimeframeChange = (timeframe: string) => {
    eventBus.publish({
      metadata: {
        version: 1,
        eventId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
        timestamp: TimeAuthority.now(),
      },
      type: 'market:timeframe_changed',
      payload: { timeframe },
    });
  };

  const handleOpenPalette = () => {
    uiDispatch({
      metadata: {
        version: 1,
        eventId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
        timestamp: TimeAuthority.now(),
      },
      type: 'ui:palette_toggled',
      payload: {},
    });
  };

  const priceVal = latestTick?.price || 0;
  const changeVal = 0;

  return (
    <header className="flex h-10 shrink-0 items-center gap-3 border-b border-border bg-panel px-3 text-[11px] select-none">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <select
          value={activeSymbol}
          onChange={(e) => handleSymbolChange(e.target.value)}
          className="h-7 w-[110px] rounded-sm border border-border bg-background px-1.5 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
        >
          {pinnedSymbols.length === 0 ? (
            <option value="" className="font-mono text-[11px] bg-panel text-muted-foreground">No Assets</option>
          ) : (
            pinnedSymbols.map((s) => (
              <option key={s} value={s} className="font-mono text-[11px] bg-panel">
                {s}
              </option>
            ))
          )}
        </select>

        <select
          value={activeTimeframe}
          onChange={(e) => handleTimeframeChange(e.target.value)}
          className="h-7 w-[60px] text-center rounded-sm border border-border bg-background px-1 font-mono text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
        >
          {timeframes.map((tf) => (
            <option key={tf} value={tf} className="font-mono text-[11px] bg-panel">
              {tf}
            </option>
          ))}
        </select>
      </div>

      {/* CENTER */}
      <div className="ml-2 flex items-center gap-3 border-l border-border pl-3">
        <span className="tnum font-mono text-[13px] font-semibold text-foreground">
          {priceVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={cn('tnum font-mono text-[11px]', changeVal >= 0 ? 'text-bull' : 'text-bear')}>
          {changeVal >= 0 ? '+' : ''}{changeVal.toFixed(2)}%
        </span>
        <StatusBadge variant="bull">MARKET ACTIVE</StatusBadge>
      </div>

      {/* RIGHT */}
      <div className="ml-auto flex items-center gap-2">
        <div className="flex h-7 items-center gap-1.5 rounded-sm border border-border px-2 py-1 font-mono text-[9px] text-muted-foreground">
          <Wifi className="h-3 w-3 text-bull" />
          <span>WS</span>
          <span className="tnum text-foreground">{health.wsLatency}ms</span>
        </div>
        <div className="flex h-7 items-center gap-1.5 rounded-sm border border-border px-2 py-1 font-mono text-[9px] text-muted-foreground">
          <Zap className="h-3 w-3 text-warn" />
          <span>INF</span>
          <span className="tnum text-foreground">{health.inferenceLatency}ms</span>
        </div>
        
        {/* Live System Runtime Indicators */}
        <StatusBadge variant="bull">{runtimeMode}</StatusBadge>
        <div className={cn(
          "flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-mono border",
          runtimeState === 'BOOTING' ? "bg-warn/10 text-warn border-warn/30" : "bg-accent text-foreground border-border"
        )}>
          {runtimeState}
        </div>

        <button
          onClick={handleOpenPalette}
          className="flex h-7 items-center gap-2 rounded-sm border border-border bg-background px-2 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Search className="h-3 w-3" />
          <span>Search Commands</span>
          <kbd className="ml-2 flex items-center gap-0.5 rounded-sm border border-border bg-panel px-1 py-0.5 font-mono text-[8px]">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        <button className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Bell className="h-3.5 w-3.5" />
        </button>
        <button 
          onClick={() => setIsAccountOpen(true)}
          className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <User className="h-3.5 w-3.5" />
        </button>
      </div>
      
      <AccountPortal isOpen={isAccountOpen} onClose={() => setIsAccountOpen(false)} />
    </header>
  );
}
export default Topbar;
