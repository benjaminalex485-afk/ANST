import React from 'react';
import { SymbolIntelligence } from '../../../types/intelligence-types';
import { TechnicalsSummaryPanel } from './TechnicalsSummaryPanel';
import { SupportResistancePanel } from './SupportResistancePanel';
import { Lock } from 'lucide-react';

interface Props {
  intel: SymbolIntelligence;
}

export function TechnicalsTabContainer({ intel }: Props) {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pb-6">
      {/* Heat Summary & Indicators & Moving Averages */}
      <TechnicalsSummaryPanel 
        rsi={intel.indicators.rsi} 
        movingAverages={intel.movingAverages} 
      />

      {/* Support & Resistance Level Mapping */}
      {intel.pivots && intel.quote && (
        <div className="px-3 mt-2">
          <SupportResistancePanel 
             pivots={intel.pivots} 
             currentPrice={intel.quote.close} 
          />
        </div>
      )}

      {/* Deliverable / Statistical Volume Section (Now Unlocked if Stats exist) */}
      <div className="px-3 mt-4 flex flex-col gap-2">
         <div className="flex items-center gap-2 font-semibold text-sm tracking-tight">
           Volume Analytics <span className="text-[10px] text-muted-foreground/50 font-normal">(Statistics)</span>
         </div>
         
         {intel.stats ? (
           <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#1c212d] p-3 border border-white/5 rounded flex flex-col gap-1">
                 <span className="text-[10px] text-muted-foreground font-mono uppercase">10D Avg Vol</span>
                 <span className="text-xs font-bold font-mono text-emerald-400">
                   {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(intel.stats.avg10Volume || 0)}
                 </span>
              </div>
              <div className="bg-[#1c212d] p-3 border border-white/5 rounded flex flex-col gap-1">
                 <span className="text-[10px] text-muted-foreground font-mono uppercase">90D Avg Vol</span>
                 <span className="text-xs font-bold font-mono text-cyan-400">
                   {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(intel.stats.avg90Volume || 0)}
                 </span>
              </div>
           </div>
         ) : (
           <div className="h-24 flex items-end gap-3 px-4 pb-2 border-b border-white/5 relative bg-[#1c212d]/30 rounded">
              {[30, 45, 55, 60, 70].map((h, i) => (
                 <div key={i} className="flex-1 flex gap-1 items-end justify-center h-full">
                    <div className="w-3 bg-indigo-500/30 rounded-t-sm" style={{ height: `${h}%` }} />
                    <div className="w-3 bg-cyan-500/30 rounded-t-sm" style={{ height: `${h * 0.6}%` }} />
                 </div>
              ))}
              <div className="absolute inset-0 backdrop-blur-[2px] bg-black/40 flex items-center justify-center rounded">
                 <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-zinc-300 bg-[#0d1117] px-3 py-2 border border-white/10 rounded-sm shadow-2xl">
                   <Lock className="w-3.5 h-3.5 text-indigo-400" /> EOD Delivery Stream Locked
                 </div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
}
