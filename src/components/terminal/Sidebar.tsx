import { useState } from 'react';
import {
  LayoutDashboard,
  CandlestickChart,
  Radio,
  Wallet,
  ListOrdered,
  ShieldAlert,
  FlaskConical,
  Brain,
  ScrollText,
  Activity,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Circle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/ui-store';
import { TimeAuthority } from '../../services/time-authority';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { id: 'market', label: 'Market', icon: CandlestickChart, to: '/market' },
  { id: 'signals', label: 'Signals', icon: Radio, to: '/signals' },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet, to: '/portfolio' },
  { id: 'orders', label: 'Orders', icon: ListOrdered, to: '/orders' },
  { id: 'risk', label: 'Risk', icon: ShieldAlert, to: '/risk' },
  { id: 'strategy-lab', label: 'Strategy Lab', icon: FlaskConical, to: '/strategy-lab' },
  { id: 'explainability', label: 'Explainability', icon: Brain, to: '/explainability' },
  { id: 'logs', label: 'Logs', icon: ScrollText, to: '/logs' },
  { id: 'health', label: 'Health', icon: Activity, to: '/health' },
  { id: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
] as const;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const activeTab = useUIStore((state) => state.activeTab);
  const uiDispatch = useUIStore((state) => state.dispatch);

  const handleTabSelect = (tabId: string) => {
    uiDispatch({
      metadata: {
        version: 1,
        eventId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
        timestamp: TimeAuthority.now(),
      },
      type: 'ui:tab_changed',
      payload: { tab: tabId },
    });
  };

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-150 select-none shrink-0',
        collapsed ? 'w-12' : 'w-48'
      )}
    >
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
        <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
        {!collapsed && (
          <span className="font-mono text-[11px] font-semibold tracking-wider text-foreground">
            QUANT.OS
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabSelect(item.id)}
              className={cn(
                'group relative flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[11px] transition-colors',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                active && 'bg-sidebar-accent text-sidebar-accent-foreground'
              )}
            >
              {active && (
                <span className="absolute left-0 top-0 h-full w-[2px] bg-primary" />
              )}
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border p-2 shrink-0">
        <div className="flex items-center justify-between gap-2 px-1 py-1">
          {!collapsed && (
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
              <Circle className="h-2 w-2 fill-bull text-bull animate-pulse" />
              <span className="font-mono uppercase tracking-wider">
                Operational
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="ml-auto rounded-sm p-1 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronsRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronsLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        {!collapsed && (
          <div className="px-1 pt-1 font-mono text-[9px] text-muted-foreground">
            v1.0.0 · build 4f2a
          </div>
        )}
      </div>
    </aside>
  );
}
export default Sidebar;
