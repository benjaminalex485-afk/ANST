import React from 'react';
import { IndicatorValue, MovingAverageItem } from '../../../types/intelligence-types';
import { Info } from 'lucide-react';
import { cn } from '../../../../../lib/utils';

interface Props {
  rsi: IndicatorValue | null;
  movingAverages: MovingAverageItem[];
}

export function TechnicalsSummaryPanel({ rsi, movingAverages }: Props) {
  
  // Synthesize overall verdict based on RSI logic for demonstration
  const rsiVal = rsi?.value || 50;
  let verdict = "Neutral";
  let pointerPos = 50;
  let vColor = "text-zinc-400";

  if (rsiVal < 40) { verdict = "Bullish"; pointerPos = 75; vColor = "text-emerald-500"; }
  else if (rsiVal > 60) { verdict = "Bearish"; pointerPos = 25; vColor = "text-red-500"; }

  const dashCount = 20;

  return (
    <div className="flex flex-col gap-5 p-3">
      
      {/* Heat Meter Summary Card */}
      <div className="p-4 rounded-md bg-[#1c212d] border border-white/5 flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground font-mono">Based on technicals, this stock is</span>
          <span className={cn("text-base font-bold", vColor)}>{verdict}</span>
        </div>

        <div className="relative flex flex-col">
          {/* Heat Dashes */}
          <div className="flex gap-[2px] h-5 w-full justify-between items-end">
            {Array.from({ length: dashCount }).map((_, i) => {
              const pct = i / dashCount;
              // Gradient from dark red to dark green
              let colorClass = "bg-zinc-700";
              if (pct < 0.3) colorClass = "bg-red-500/70";
              else if (pct < 0.7) colorClass = "bg-yellow-500/50";
              else colorClass = "bg-emerald-500/70";

              return <div key={i} className={cn("flex-1 rounded-t-sm", colorClass)} style={{ height: '100%' }} />;
            })}
          </div>
          {/* Pointer */}
          <div 
            className="absolute -bottom-3 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-transparent border-t-white transition-all duration-700"
            style={{ left: `${pointerPos}%`, transform: 'translateX(-50%)' }}
          />
        </div>

        <div className="flex justify-between items-center mt-1 pt-2 border-t border-white/5 font-mono text-[10px]">
           <div className="flex items-center gap-1.5"><div className="w-1 h-3 bg-red-500" /> Bearish</div>
           <div className="flex items-center gap-1.5"><div className="w-1 h-3 bg-zinc-500" /> Neutral</div>
           <div className="flex items-center gap-1.5"><div className="w-1 h-3 bg-emerald-500" /> Bullish</div>
        </div>
      </div>

      {/* Indicators Table */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 font-semibold text-sm tracking-tight">
          Indicators <Info className="w-3 h-3 opacity-40" />
        </div>
        <div className="rounded-sm border border-white/5 overflow-hidden bg-[#1c212d]/40">
          <div className="grid grid-cols-3 p-2 text-[10px] text-muted-foreground font-mono uppercase border-b border-white/5">
            <span>Indicator</span>
            <span>Value</span>
            <span>Verdict</span>
          </div>
          <div className="grid grid-cols-3 p-2 text-[11px] font-mono items-center border-b border-white/5">
            <span className="text-foreground/90">RSI (14)</span>
            <span className="font-bold text-foreground">{rsiVal.toFixed(2)}</span>
            <span className={cn(rsiVal > 70 ? "text-red-500" : rsiVal < 30 ? "text-emerald-500" : "text-zinc-400")}>
              {rsiVal > 70 ? "Overbought" : rsiVal < 30 ? "Oversold" : "Neutral"}
            </span>
          </div>
          <div className="grid grid-cols-3 p-2 text-[11px] font-mono items-center">
            <span className="text-foreground/90">ADX</span>
            <span className="font-bold text-foreground">22.40</span>
            <span className="text-zinc-400">Weak Trend</span>
          </div>
        </div>
      </div>

      {/* Moving Averages Table */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-2 font-semibold text-sm tracking-tight">
          Moving Averages <Info className="w-3 h-3 opacity-40" />
        </div>
        <div className="rounded-sm border border-white/5 overflow-hidden bg-[#1c212d]/40">
          <div className="grid grid-cols-3 p-2 text-[10px] text-muted-foreground font-mono uppercase border-b border-white/5">
            <span>Period</span>
            <span>MA</span>
            <span>EMA</span>
          </div>
          {movingAverages.map(ma => (
            <div key={ma.period} className="grid grid-cols-3 p-2 text-[11px] font-mono items-center border-b border-white/5 last:border-0">
              <span className="text-foreground/80">{ma.period}</span>
              <span className="text-emerald-500">{ma.ma.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
              <span className="text-emerald-500">{ma.ema.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
