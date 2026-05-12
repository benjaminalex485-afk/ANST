import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

type Variant = 'bull' | 'bear' | 'warn' | 'info' | 'neutral';

const styles: Record<Variant, string> = {
  bull: 'border-bull/40 bg-bull/10 text-bull',
  bear: 'border-bear/40 bg-bear/10 text-bear',
  warn: 'border-warn/40 bg-warn/10 text-warn',
  info: 'border-info/40 bg-info/10 text-info',
  neutral: 'border-border bg-muted text-muted-foreground',
};

export function StatusBadge({
  variant = 'neutral',
  children,
  className,
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider select-none',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
export default StatusBadge;
