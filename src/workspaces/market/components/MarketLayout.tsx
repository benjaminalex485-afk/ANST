import React from 'react';
import { MarketChart } from './MarketChart';
import { WatchlistPanel } from './WatchlistPanel';
import { useMarketStore } from '../../../store/market-store';
import { StatusBadge } from '../../../components/terminal/StatusBadge';
import { Activity, Wifi } from 'lucide-react';

import { ResearchSidebar } from './ResearchSidebar';

export function MarketLayout() {
  const feedStatus = useMarketStore(state => state.feedStatus);

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
        {/* Column A: Operations Sidecar (Watchlist) */}
        <div className="w-56 flex flex-col gap-2 shrink-0 min-h-0">
          <WatchlistPanel />
        </div>

        {/* Column B: Heavyweight Workspace Canvas (Chart) */}
        <div className="flex-1 flex flex-col min-w-0 border border-border rounded-sm overflow-hidden bg-panel">
          <MarketChart />
        </div>

        {/* Column C: Deep Intelligence Research Hub (Fundamentals / News) */}
        <div className="w-80 xl:w-96 flex flex-col gap-2 shrink-0 min-h-0">
          <ResearchSidebar />
        </div>
      </div>
    </div>
  );
}
