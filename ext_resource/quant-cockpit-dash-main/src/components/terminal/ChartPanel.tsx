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
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <defs>
              <pattern id="chart-grid" width="40" height="32" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-grid-line" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#chart-grid)" />
            
            {/* Live active tick line */}
            <polyline
              fill="none"
              strokeWidth="1.25"
              className="stroke-info"
              points="0,150 40,140 80,145 120,120 160,130 200,105 240,118 280,80 320,92 360,65 400,75 440,50 480,58 520,35 560,42 600,20 640,28 680,15"
            />
            {/* Moving average mock dotted line */}
            <polyline
              fill="none"
              strokeWidth="1"
              strokeDasharray="2 3"
              className="stroke-warn opacity-50"
              points="0,140 680,25"
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
