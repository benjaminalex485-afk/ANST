import React from 'react';
import { IntelligenceQuote } from '../../../types/intelligence-types';
import { Info } from 'lucide-react';

interface Props {
  quote: IntelligenceQuote;
}

export function PerformancePanel({ quote }: Props) {
  // Helper to calculate relative pointer position percentage (0-100)
  const calcPos = (val: number, min: number, max: number) => {
    if (max === min) return 50;
    const p = ((val - min) / (max - min)) * 100;
    return Math.min(100, Math.max(0, p));
  };

  const todayPos = calcPos(quote.close, quote.low, quote.high);
  const yearPos = calcPos(quote.close, quote.fifty_two_week.low, quote.fifty_two_week.high);

  const formatVal = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col gap-6 p-3 bg-transparent text-foreground">
      <div className="flex items-center gap-2 font-semibold text-sm tracking-tight">
        Performance <Info className="w-3 h-3 opacity-40" />
      </div>

      {/* Today's Range */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>Today's Low</span>
          <span>Today's High</span>
        </div>
        <div className="flex justify-between text-xs font-bold font-mono">
          <span>{formatVal(quote.low)}</span>
          <span>{formatVal(quote.high)}</span>
        </div>
        
        {/* The Slider Track */}
        <div className="relative h-1.5 bg-zinc-800 rounded-full mt-2 overflow-visible">
          <div className="absolute h-full bg-white/20 rounded-full w-full" />
          {/* Triangle Pointer */}
          <div 
            className="absolute top-full mt-0.5 transition-all duration-500"
            style={{ left: `${todayPos}%`, transform: 'translateX(-50%)' }}
          >
             <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-transparent border-b-foreground" />
          </div>
        </div>
      </div>

      {/* 52 Week Range */}
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>52 Week Low</span>
          <span>52 Week High</span>
        </div>
        <div className="flex justify-between text-xs font-bold font-mono">
          <span>{formatVal(quote.fifty_two_week.low)}</span>
          <span>{formatVal(quote.fifty_two_week.high)}</span>
        </div>
        
        <div className="relative h-1.5 bg-zinc-800 rounded-full mt-2 overflow-visible">
          <div className="absolute h-full bg-white/20 rounded-full w-full" />
          {/* Triangle Pointer */}
          <div 
            className="absolute top-full mt-0.5 transition-all duration-500"
            style={{ left: `${yearPos}%`, transform: 'translateX(-50%)' }}
          >
             <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-transparent border-b-foreground" />
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-3 gap-y-4 mt-3 text-left">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground">Open</span>
          <span className="text-xs font-bold font-mono">{formatVal(quote.open)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground">Prev. Close</span>
          <span className="text-xs font-bold font-mono">{formatVal(quote.previous_close)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground">Volume</span>
          <span className="text-xs font-bold font-mono">{(quote.volume / 1000000).toFixed(2)}M</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground">Lower Circuit</span>
          <span className="text-xs font-bold font-mono text-muted-foreground/50">—</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground">Upper Circuit</span>
          <span className="text-xs font-bold font-mono text-muted-foreground/50">—</span>
        </div>
      </div>
    </div>
  );
}
