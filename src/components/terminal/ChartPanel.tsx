import { Maximize2, Settings2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TerminalPanel } from './TerminalPanel';
import { useMarketStore } from '../../store/market-store';

const tools = ['Crosshair', 'Trend', 'Fib', 'Measure'];
const indicators = ['EMA(20)', 'EMA(50)', 'VWAP', 'RSI', 'MACD', 'BBands'];

export function ChartPanel() {
  const activeSymbol = useMarketStore((state) => state.activeSymbol);
  const activeTimeframe = useMarketStore((state) => state.activeTimeframe);
  const latestTick = useMarketStore((state) => state.latestTick);

  const priceVal = latestTick?.price || 64320.5;

  return (
    <TerminalPanel
      title={`${activeSymbol} · ${activeTimeframe}`}
      subtitle="SIMULATOR · SPOT"
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
      className="min-h-[300px]"
    >
      <div className="flex h-full flex-col select-none">
        {/* Sub-toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-2.5 py-1 shrink-0">
          <div className="flex items-center gap-1">
            {tools.map((t, i) => (
              <button
                key={t}
                className={cn(
                  'rounded-sm border border-border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors',
                  i === 0 && 'bg-accent text-foreground'
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1">
            {indicators.map((ind, i) => (
              <button
                key={ind}
                className={cn(
                  'rounded-sm border border-border px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors',
                  i < 3 && 'border-info/40 bg-info/10 text-info'
                )}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="relative flex-1 overflow-hidden bg-background">
          {/* Custom SVG Gridlines and spark plots */}
          <svg 
            className="absolute inset-0 h-full w-full" 
            viewBox="0 0 680 300"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="chart-grid" width="40" height="30" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.3" />
              </pattern>
              <linearGradient id="line-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Subtle Grid */}
            <rect width="100%" height="100%" fill="url(#chart-grid)" />
            
            {/* Fill Gradient Area */}
            <polyline
              fill="url(#line-glow)"
              stroke="none"
              points="0,200 40,180 80,190 120,150 160,165 200,120 240,140 280,90 320,110 360,65 400,85 440,45 480,60 520,25 560,38 600,15 640,22 680,5 680,300 0,300"
            />

            {/* Live active tick line with filter glow */}
            <polyline
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2"
              filter="url(#glow)"
              points="0,200 40,180 80,190 120,150 160,165 200,120 240,140 280,90 320,110 360,65 400,85 440,45 480,60 520,25 560,38 600,15 640,22 680,5"
            />
            {/* Moving average mock dotted line */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.5"
              points="0,180 680,35"
            />
          </svg>

          {/* Right Y-Axis labels */}
          <div className="absolute right-1 top-0 flex h-full flex-col justify-between py-2 font-mono text-[8px] text-muted-foreground">
            <span>{(priceVal + 400).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span>{(priceVal + 200).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span>{priceVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span>{(priceVal - 200).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            <span>{(priceVal - 400).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>

          {/* Left info stats overlay */}
          <div className="absolute left-2.5 top-2 flex flex-col gap-0.5 font-mono text-[9px] text-muted-foreground">
            <span>O <span className="text-foreground">{(priceVal - 100).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span></span>
            <span>H <span className="text-bull">{(priceVal + 150).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span></span>
            <span>L <span className="text-bear">{(priceVal - 180).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span></span>
            <span>C <span className="text-foreground">{priceVal.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span></span>
            <span>V <span className="text-foreground">14,242</span></span>
          </div>
        </div>
      </div>
    </TerminalPanel>
  );
}
export default ChartPanel;
