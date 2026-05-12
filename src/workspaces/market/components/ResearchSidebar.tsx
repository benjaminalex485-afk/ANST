import React, { useState } from 'react';
import { useMarketStore } from '../../../store/market-store';
import { cn } from '../../../lib/utils';
import { Info, Activity, Newspaper, Calendar, Loader2, AlertCircle } from 'lucide-react';

// Data Layer
import { useSymbolIntelligence } from '../hooks/useSymbolIntelligence';

// Native Visual Modules
import { PerformancePanel } from './research/native/PerformancePanel';
import { FundamentalsTabContainer } from './research/native/FundamentalsTabContainer';
import { TechnicalsTabContainer } from './research/native/TechnicalsTabContainer';

// TradingView News Layer retained for optimized stream
import { TimelineWidget } from './research/TimelineWidget';

type ResearchTab = 'overview' | 'technicals' | 'news' | 'events';

export function ResearchSidebar() {
  const activeSymbol = useMarketStore((state) => state.activeSymbol);
  const [activeTab, setActiveTab] = useState<ResearchTab>('overview');

  // Hot-Wire Intelligence Feed
  const intel = useSymbolIntelligence(activeSymbol);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'technicals', label: 'Technicals', icon: Activity },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'events', label: 'Events', icon: Calendar },
  ] as const;

  if (!activeSymbol) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-muted-foreground p-4 text-center bg-[#131722] border border-border rounded-sm">
        <Info className="w-8 h-8 mb-2 opacity-20" />
        <p className="font-mono text-[11px]">Awaiting context. Select an asset to ignite physical research engine.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#131722] border border-border rounded-sm overflow-hidden shadow-2xl">
      {/* Tab Header */}
      <div className="flex items-center border-b border-white/5 bg-background/40 shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ResearchTab)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all border-b-2",
                isActive 
                  ? "text-primary border-primary bg-white/5 shadow-[inset_0_-10px_20px_rgba(255,255,255,0.02)]" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? "text-primary" : "text-muted-foreground/50")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Master Loading & Error Interceptors */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#131722] relative">
        
        {intel.loading && (
          <div className="absolute inset-0 z-50 bg-[#131722]/80 backdrop-blur-md flex flex-col items-center justify-center text-primary gap-2 font-mono text-[10px] uppercase tracking-widest">
            <Loader2 className="w-5 h-5 animate-spin" /> Initializing Ingress...
          </div>
        )}

        {intel.error && (
          <div className="p-4 text-center text-red-400/80 font-mono text-[10px] flex flex-col items-center gap-2 mt-10">
             <AlertCircle className="w-5 h-5" />
             PHYSICAL API LINK FAULT<br/>{intel.error}
          </div>
        )}

        {!intel.loading && !intel.error && (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="flex flex-col divide-y divide-white/5">
                {intel.quote && <PerformancePanel quote={intel.quote} />}
                <FundamentalsTabContainer intel={intel} />
              </div>
            )}

            {/* TECHNICALS TAB */}
            {activeTab === 'technicals' && (
              <TechnicalsTabContainer intel={intel} />
            )}

            {/* NEWS TAB */}
            {activeTab === 'news' && (
              <div className="h-full w-full">
                <TimelineWidget />
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="flex flex-col h-full items-center justify-center text-muted-foreground p-8 text-center">
                 <Calendar className="w-6 h-6 mb-2 opacity-30" />
                 <p className="font-mono text-[10px] uppercase font-bold tracking-widest">Event Sequence Empty</p>
                 <p className="font-mono text-[9px] opacity-60 mt-1">No scheduled earnings distributions found in immediate lookahead.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
