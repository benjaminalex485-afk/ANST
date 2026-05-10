import { Filter } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TerminalPanel } from './TerminalPanel';
import { StatusBadge } from './StatusBadge';
import { useSignalStore } from '../../store/signal-store';
import { AISignal } from '../../types/signal';

export function SignalCard({ s }: { s: AISignal }) {
  const tone = s.direction === 'BUY' ? 'bull' : s.direction === 'SELL' ? 'bear' : 'neutral';
  const timeStr = new Date(s.timestamp).toLocaleTimeString();

  return (
    <div className="border-b border-border px-2.5 py-2 hover:bg-panel-elevated transition-colors">
      <div className="flex items-center gap-2 select-none">
        <StatusBadge variant={tone}>{s.direction}</StatusBadge>
        <span className="font-mono text-[11px] font-semibold text-foreground">
          {s.symbol}
        </span>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground">
          {timeStr}
        </span>
      </div>
      <div className="mt-1.5 flex items-center gap-2 select-none">
        <div className="flex-1">
          <div className="h-1 overflow-hidden rounded-sm bg-muted">
            <div
              className={cn(
                'h-full',
                tone === 'bull' ? 'bg-bull' : tone === 'bear' ? 'bg-bear' : 'bg-info'
              )}
              style={{ width: `${s.confidence}%` }}
            />
          </div>
        </div>
        <span className="tnum font-mono text-[9px] text-muted-foreground">
          {s.confidence}%
        </span>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 font-mono text-[9px] text-muted-foreground select-none">
        <span className="rounded-sm border border-border px-1 py-0.5 text-foreground bg-panel-elevated">
          {s.strategyName}
        </span>
        <span className="rounded-sm border border-border px-1 py-0.5">
          regime: {s.regime.toLowerCase()}
        </span>
      </div>
      <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground">
        {s.reasoning[0] || 'Awaiting reasoning criteria.'}
      </p>
    </div>
  );
}

export function SignalsPanel() {
  const signals = useSignalStore((state) => state.signals);

  // Fallback signals before simulation starts
  const displaySignals: AISignal[] = signals.length > 0 ? signals : [
    {
      id: 's1',
      symbol: 'BTC/USD',
      direction: 'BUY',
      confidence: 82,
      riskScore: 30,
      strategyName: 'MACD-XOver',
      regime: 'BULLISH',
      timestamp: Date.now(),
      reasoning: ['MACD bullish crossover with rising volume; price reclaims 4H EMA50.'],
    },
    {
      id: 's2',
      symbol: 'ETH/USD',
      direction: 'HOLD',
      confidence: 54,
      riskScore: 20,
      strategyName: 'MeanReversion',
      regime: 'NEUTRAL',
      timestamp: Date.now() - 300000,
      reasoning: ['Price within 0.6σ of mean; insufficient edge for entry.'],
    },
    {
      id: 's3',
      symbol: 'SOL/USD',
      direction: 'SELL',
      confidence: 71,
      riskScore: 45,
      strategyName: 'VolBreakdown',
      regime: 'VOLATILE',
      timestamp: Date.now() - 600000,
      reasoning: ['Volatility contraction broken to downside; failed retest of prior support.'],
    },
  ];

  return (
    <TerminalPanel
      title="AI Signals"
      subtitle={`${displaySignals.length} active · last 30m`}
      scroll
      actions={
        <button className="rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
          <Filter className="h-3 w-3" />
        </button>
      }
    >
      <div className="flex flex-col">
        {displaySignals.map((s) => (
          <SignalCard key={s.id} s={s} />
        ))}
      </div>
    </TerminalPanel>
  );
}
export default SignalsPanel;
