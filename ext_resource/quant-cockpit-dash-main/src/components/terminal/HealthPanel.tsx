import { cn } from '../../lib/utils';
import { TerminalPanel } from './TerminalPanel';
import { useHealthStore } from '../../store/health-store';

function Sparkline({ tone = 'info' }: { tone?: 'bull' | 'bear' | 'warn' | 'info' }) {
  const stroke = {
    bull: 'stroke-bull',
    bear: 'stroke-bear',
    warn: 'stroke-warn',
    info: 'stroke-info',
  }[tone];
  const d = 'M0,14 L8,11 L16,12 L24,8 L32,10 L40,6 L48,9 L56,5 L64,7 L72,4';
  return (
    <svg viewBox="0 0 72 18" className="h-4 w-full select-none" preserveAspectRatio="none">
      <path d={d} fill="none" strokeWidth="1.25" className={cn(stroke)} />
    </svg>
  );
}

export function SystemMetric({
  label,
  value,
  unit,
  tone = 'info',
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: 'bull' | 'bear' | 'warn' | 'info';
}) {
  return (
    <div className="flex flex-col gap-1 border border-border bg-panel px-2.5 py-2">
      <div className="flex items-center justify-between select-none">
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-0.5">
        <span className="tnum font-mono text-[13px] font-semibold text-foreground">
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[9px] text-muted-foreground">{unit}</span>
        )}
      </div>
      <Sparkline tone={tone} />
    </div>
  );
}

export function HealthPanel() {
  const health = useHealthStore((state) => state.health);

  return (
    <TerminalPanel title="System Health" subtitle="all subsystems">
      <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-6 h-full">
        <SystemMetric
          label="CPU"
          value={health.cpuUsage.toFixed(1)}
          unit="%"
          tone={health.cpuUsage > 60 ? 'warn' : 'info'}
        />
        <SystemMetric
          label="Memory"
          value={health.memoryUsage.toFixed(1)}
          unit="%"
          tone={health.memoryUsage > 60 ? 'warn' : 'info'}
        />
        <SystemMetric
          label="WS Latency"
          value={health.wsLatency.toString()}
          unit="ms"
          tone={health.wsLatency > 40 ? 'warn' : 'bull'}
        />
        <SystemMetric
          label="Queue Depth"
          value={health.queueDepth.toString()}
          tone={health.queueDepth > 10 ? 'warn' : 'bull'}
        />
        <SystemMetric
          label="Inference"
          value={health.inferenceLatency.toFixed(1)}
          unit="ms"
          tone="bull"
        />
        <SystemMetric
          label="Broker status"
          value={health.brokerConnected ? 'ON' : 'OFF'}
          tone={health.brokerConnected ? 'bull' : 'bear'}
        />
      </div>
    </TerminalPanel>
  );
}
export default HealthPanel;
