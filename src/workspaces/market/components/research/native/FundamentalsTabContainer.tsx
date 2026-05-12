import React, { useState } from 'react';
import { Info, Lock, DollarSign } from 'lucide-react';
import { cn } from '../../../../../lib/utils';
import { SymbolIntelligence } from '../../../types/intelligence-types';

interface Props {
  intel: SymbolIntelligence;
}

export function FundamentalsTabContainer({ intel }: Props) {
  const [finMode, setFinMode] = useState<'rev' | 'prof'>('rev');

  const s = intel.stats;

  // Format helpers
  const fmtB = (n: number) => {
    if (!n) return '—';
    if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    return n.toLocaleString();
  };

  const fmt2 = (n: number | undefined) => n ? n.toFixed(2) : '—';
  const fmtPct = (n: number | undefined) => n ? `${(n * 100).toFixed(2)}%` : '—';

  return (
    <div className="flex flex-col gap-6 p-3">
      
      {/* Fundamentals List (Now Physical) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 font-semibold text-sm tracking-tight">
          Fundamentals <Info className="w-3 h-3 opacity-40" />
        </div>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-1">
          <div className="flex flex-col border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-muted-foreground font-mono uppercase">Mkt Cap</span>
            <span className="text-xs font-bold font-mono text-foreground">{s ? fmtB(s.marketCap) : '—'}</span>
          </div>
          <div className="flex flex-col border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-muted-foreground font-mono uppercase">ROE</span>
            <span className="text-xs font-bold font-mono text-foreground">{s ? fmtPct(s.roe) : '—'}</span>
          </div>
          <div className="flex flex-col border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-muted-foreground font-mono uppercase">P/E Ratio (TTM)</span>
            <span className="text-xs font-bold font-mono text-foreground">{s ? fmt2(s.trailingPE) : '—'}</span>
          </div>
          <div className="flex flex-col border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-muted-foreground font-mono uppercase">EPS (TTM)</span>
            <span className="text-xs font-bold font-mono text-foreground">{s ? fmt2(s.eps) : '—'}</span>
          </div>
          <div className="flex flex-col border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-muted-foreground font-mono uppercase">Book Value</span>
            <span className="text-xs font-bold font-mono text-foreground">{s ? fmt2(s.bookValue) : '—'}</span>
          </div>
          <div className="flex flex-col border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-muted-foreground font-mono uppercase">Debt / Eq</span>
            <span className="text-xs font-bold font-mono text-foreground">{s ? fmt2(s.debtToEquity) : '—'}</span>
          </div>
        </div>
      </div>

      {/* Financials (Simplified Physical from TTM Stats) */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm tracking-tight">
            Financials (TTM) <Info className="w-3 h-3 opacity-40" />
          </div>
        </div>
        
        {!s ? (
           <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded bg-[#1c212d]/30 text-center">
              <Lock className="w-4 h-4 mb-1 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold">Physical Financials Unavailable</span>
           </div>
        ) : (
          <div className="p-3 bg-[#1c212d] border border-white/5 rounded-sm flex flex-col gap-3">
             <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                   <span className="text-[11px] text-muted-foreground">Total Revenue</span>
                </div>
                <span className="text-xs font-bold font-mono text-emerald-400">{fmtB(s.revenueTTM)}</span>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-500 rounded-full" />
                   <span className="text-[11px] text-muted-foreground">Net Income</span>
                </div>
                <span className="text-xs font-bold font-mono text-blue-400">{fmtB(s.netIncomeTTM)}</span>
             </div>
          </div>
        )}
      </div>

      {/* Shareholding Pattern (Now Physically Unlocked from Insiders/Institutions data) */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex items-center gap-2 font-semibold text-sm tracking-tight">
          Distribution Structure <Info className="w-3 h-3 opacity-40" />
        </div>
        
        {!s ? (
           <div className="text-[10px] font-mono text-muted-foreground italic">Telemetry offline.</div>
        ) : (
          <div className="flex flex-col gap-3 font-mono text-[11px]">
            {[
              { l: 'Institutions', v: s.institutionalHoldings },
              { l: 'Insiders', v: s.insiderHoldings },
              { l: 'Others', v: Math.max(0, 1 - (s.institutionalHoldings + s.insiderHoldings)) }
            ].map((item) => {
              const pct = item.v * 100;
              return (
                <div key={item.l} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between opacity-80 text-foreground">
                    <span>{item.l}</span>
                    <span className="font-bold">{pct.toFixed(2)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-1000", item.l === 'Institutions' ? "bg-emerald-500" : item.l === 'Insiders' ? "bg-cyan-500" : "bg-zinc-600")} 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
