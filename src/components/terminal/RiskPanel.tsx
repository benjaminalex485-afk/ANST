import { Power } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TerminalPanel } from './TerminalPanel';
import { StatusBadge } from './StatusBadge';
import { useRiskStore } from '../../store/risk-store';

export function RiskGauge({
  label,
  value,
  pct,
  tone = 'info',
}: {
  label: string;
  value: string;
  pct: number;
  tone?: 'bull' | 'bear' | 'warn' | 'info';
}) {
  const toneBar = {
    bull: 'bg-bull',
    bear: 'bg-bear',
    warn: 'bg-warn',
    info: 'bg-info',
  }[tone];

  return (
    <div className="flex flex-col gap-1 px-2.5 py-1.5 select-none">
      <div className="flex items-center justify-between font-mono text-[9px]">
        <span className="uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="tnum text-foreground">{value}</span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-sm bg-muted">
        <div
          className={cn('h-full', toneBar)}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
        <div className="pointer-events-none absolute inset-y-0 left-[60%] w-px bg-warn/40" />
        <div className="pointer-events-none absolute inset-y-0 left-[85%] w-px bg-bear/40" />
      </div>
    </div>
  );
}

export function RiskPanel() {
  const metrics = useRiskStore((state) => state.metrics);
  const killSwitchTriggered = useRiskStore((state) => state.killSwitchTriggered);
  const dispatch = useRiskStore((state) => state.dispatch);

  const handleKillSwitch = () => {
    if (confirm('CRITICAL ACTION: Are you sure you want to engage the emergency kill switch? This will liquidate positions and freeze execution.')) {
      dispatch({
        metadata: {
          version: 1,
          eventId: crypto.randomUUID(),
          correlationId: crypto.randomUUID(),
          timestamp: Date.now(),
        },
        type: 'risk:kill_switch_triggered',
        payload: {},
      });
    }
  };

  const exposureLimit = 2000000;
  const leverageLimit = 5.0;
  const drawdownLimit = -10.0;

  const exposurePct = (metrics.exposure / exposureLimit) * 100;
  const leveragePct = (metrics.leverage / leverageLimit) * 100;
  const drawdownPct = (Math.abs(metrics.drawdown) / Math.abs(drawdownLimit)) * 100;

  return (
    <TerminalPanel
      title="Risk Monitor"
      subtitle={killSwitchTriggered ? 'STOPPED' : 'ACTIVE'}
      actions={
        killSwitchTriggered ? (
          <StatusBadge variant="bear">BREACHED</StatusBadge>
        ) : (
          <StatusBadge variant={exposurePct > 60 ? 'warn' : 'bull'}>
            {exposurePct > 60 ? 'ELEVATED' : 'STABLE'}
          </StatusBadge>
        )
      }
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 divide-y divide-border">
          <RiskGauge
            label="Exposure"
            value={`$${metrics.exposure.toLocaleString()} / $${exposureLimit.toLocaleString()}`}
            pct={exposurePct}
            tone={exposurePct > 60 ? 'warn' : 'info'}
          />
          <RiskGauge
            label="Leverage"
            value={`${metrics.leverage.toFixed(2)}x / ${leverageLimit.toFixed(1)}x`}
            pct={leveragePct}
            tone={leveragePct > 60 ? 'warn' : 'info'}
          />
          <RiskGauge
            label="Drawdown"
            value={`${metrics.drawdown.toFixed(2)}% / ${drawdownLimit}%`}
            pct={drawdownPct}
            tone={drawdownPct > 50 ? 'warn' : 'info'}
          />
          <RiskGauge
            label="VaR (95%, 1d)"
            value={`$${metrics.valueAtRisk.toLocaleString()}`}
            pct={metrics.riskUtilization}
            tone={metrics.riskUtilization > 60 ? 'warn' : 'info'}
          />
          <RiskGauge
            label="Risk Utilization"
            value={`${metrics.riskUtilization.toFixed(1)}%`}
            pct={metrics.riskUtilization}
            tone={metrics.riskUtilization > 60 ? 'warn' : 'info'}
          />
        </div>
        <div className={cn('border-t border-border p-2.5 shrink-0 transition-colors', killSwitchTriggered ? 'bg-bear/20' : 'bg-bear/5')}>
          <button
            onClick={handleKillSwitch}
            disabled={killSwitchTriggered}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-sm border px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest transition-colors',
              killSwitchTriggered
                ? 'border-red-900 bg-red-950/40 text-red-500 cursor-not-allowed'
                : 'border-bear/60 bg-bear/15 text-bear hover:bg-bear/25'
            )}
          >
            <Power className="h-3.5 w-3.5" />
            {killSwitchTriggered ? 'Kill Switch Active' : 'Engage Kill Switch'}
          </button>
          <p className="mt-1.5 text-center font-mono text-[9px] text-muted-foreground select-none">
            Halts execution · cancels open orders · closes positions
          </p>
        </div>
      </div>
    </TerminalPanel>
  );
}
export default RiskPanel;
