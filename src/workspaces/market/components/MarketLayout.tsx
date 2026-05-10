import React, { useEffect, useRef } from 'react';
import { MarketChart } from './MarketChart';
import { WatchlistPanel } from './WatchlistPanel';
import { useMarketStore } from '../../../store/market-store';
import { MarketFeedService } from '../services/market-feed-service';
import { StatusBadge } from '../../../components/terminal/StatusBadge';
import { validateEnv } from '../../../config/env.schema';
import { Activity, Wifi } from 'lucide-react';

// 🛡️ PERSISTENT SERVICE BOUNDARY: Lift service instance above React's volatile component lifecycle.
// This eliminates duplicate API calls (which trigger 429 rate limits) during React 18 Strict Mode double-remounts.
let persistentFeedService: MarketFeedService | null = null;

export function MarketLayout() {
  const activeSymbol = useMarketStore(state => state.activeSymbol);
  const timeframe = useMarketStore(state => state.activeTimeframe);
  const feedStatus = useMarketStore(state => state.feedStatus);

  // 🚀 Unified Persistence Engine: Instantiates EXACTLY ONCE per application session.
  useEffect(() => {
    if (!persistentFeedService) {
      const rawKey = import.meta.env.VITE_TWELVE_DATA_API_KEY || 'demo';
      console.log("[DEBUG] Bootstrapping Singleton MarketFeedService Engine...");
      persistentFeedService = new MarketFeedService(rawKey);
    }
    
    if (activeSymbol && timeframe) {
      console.log(`[DEBUG] Singleton Engine subscribing to: ${activeSymbol} @ ${timeframe}`);
      persistentFeedService.subscribeToSymbol(activeSymbol, timeframe);
    }

    // Note: We explicitly DO NOT dispose the singleton on React unmount to preserve live stream 
    // continuity across brief tab toggles and dynamic reconciliation flashes!
  }, [activeSymbol, timeframe]);

  return (
    <div className="flex flex-col h-full gap-2 animate-in fade-in duration-300">
      
      {/* Sub-header Toolbar specific to Market Workstation */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <div className="flex items-center gap-2">
          <StatusBadge variant={feedStatus === 'STREAMING' ? 'bull' : 'warn'}>
            {feedStatus}
          </StatusBadge>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-emerald-500" /> RT DATA
          </span>
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-info" /> 1HZ
          </span>
        </div>
      </div>

      {/* Core Split Layout */}
      <div className="flex-1 flex min-h-0 gap-2">
        {/* Column A: Operations Sidecar */}
        <div className="w-56 flex flex-col gap-2 shrink-0 min-h-0">
          <WatchlistPanel />
        </div>

        {/* Column B: Heavyweight Workspace Canvas */}
        <div className="flex-1 flex flex-col min-w-0 border border-border rounded-sm overflow-hidden bg-panel">
          <MarketChart />
        </div>
      </div>
    </div>
  );
}
