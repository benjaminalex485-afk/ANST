import React from 'react';
import { PivotPoints } from '../../../types/intelligence-types';
import { Info } from 'lucide-react';

interface Props {
  pivots: PivotPoints;
  currentPrice: number;
}

export function SupportResistancePanel({ pivots, currentPrice }: Props) {
  const formatVal = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex flex-col gap-3 p-3 border border-white/5 rounded-sm bg-[#181a21]/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm tracking-tight">
          Support and Resistance <Info className="w-3 h-3 opacity-40" />
        </div>
      </div>

      <div className="flex flex-col gap-0 font-mono mt-2 relative">
        {/* Vertical Lines with values */}
        <div className="flex items-center justify-between py-1.5 text-[11px] opacity-70 border-b border-white/5">
          <span>R3</span>
          <span className="font-bold">{formatVal(pivots.r3)}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 text-[11px] opacity-70 border-b border-white/5">
          <span>R2</span>
          <span className="font-bold">{formatVal(pivots.r2)}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 text-[11px] opacity-70 border-b border-white/5">
          <span>R1</span>
          <span className="font-bold">{formatVal(pivots.r1)}</span>
        </div>

        {/* CURRENT PRICE BADGE */}
        <div className="relative my-1.5 z-10">
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-[1px] w-full bg-blue-500/40"></div>
          </div>
          <div className="flex justify-center relative">
            <div className="bg-blue-600/90 text-white px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide shadow-lg">
              PRICE {formatVal(currentPrice)}
            </div>
          </div>
        </div>

        {/* PIVOT BADGE */}
        <div className="relative my-1 z-0 opacity-90">
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-[1px] w-full bg-zinc-600/30"></div>
          </div>
          <div className="flex justify-center relative">
            <div className="bg-[#2a2e39] border border-white/10 text-muted-foreground px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">
              PIVOT {formatVal(pivots.p)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-1.5 text-[11px] opacity-70 border-t border-white/5 mt-1">
          <span>S1</span>
          <span className="font-bold">{formatVal(pivots.s1)}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 text-[11px] opacity-70 border-b border-white/5">
          <span>S2</span>
          <span className="font-bold">{formatVal(pivots.s2)}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 text-[11px] opacity-70">
          <span>S3</span>
          <span className="font-bold">{formatVal(pivots.s3)}</span>
        </div>
      </div>
    </div>
  );
}
