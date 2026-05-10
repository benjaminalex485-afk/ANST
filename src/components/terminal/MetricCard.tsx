import { cn } from '../../lib/utils';

export function MetricCard({
  label,
  value,
  delta,
  tone = 'neutral',
  unit,
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: 'bull' | 'bear' | 'warn' | 'info' | 'neutral';
  unit?: string;
}) {
  const toneClass = {
    bull: 'text-bull',
    bear: 'text-bear',
    warn: 'text-warn',
    info: 'text-info',
    neutral: 'text-foreground',
  }[tone];

  return (
    <div className="flex flex-col gap-0.5 border border-border bg-panel px-2.5 py-2">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground select-none">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn('tnum font-mono text-[15px] font-semibold', toneClass)}>
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[10px] text-muted-foreground">{unit}</span>
        )}
      </div>
      {delta && (
        <div className={cn('tnum font-mono text-[10px]', toneClass)}>{delta}</div>
      )}
    </div>
  );
}
export default MetricCard;
