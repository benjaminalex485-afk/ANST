import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

export function TerminalPanel({
  title,
  subtitle,
  actions,
  children,
  footer,
  className,
  bodyClassName,
  scroll = false,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  scroll?: boolean;
}) {
  return (
    <section
      className={cn(
        'flex min-h-0 flex-col border border-border bg-panel',
        className
      )}
    >
      <header className="flex h-8 shrink-0 items-center gap-2 border-b border-border px-2.5 select-none">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
          {title}
        </h2>
        {subtitle && (
          <span className="font-mono text-[10px] text-muted-foreground">
            {subtitle}
          </span>
        )}
        {actions && <div className="ml-auto flex items-center gap-1">{actions}</div>}
      </header>
      <div
        className={cn(
          'min-h-0 flex-1',
          scroll && 'overflow-y-auto',
          bodyClassName
        )}
      >
        {children}
      </div>
      {footer && (
        <footer className="shrink-0 border-t border-border px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground">
          {footer}
        </footer>
      )}
    </section>
  );
}
export default TerminalPanel;
