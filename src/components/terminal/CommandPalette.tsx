import { useEffect, useState, useRef } from 'react';
import {
  CandlestickChart,
  LayoutDashboard,
  Radio,
  ShieldAlert,
  Wallet,
  ListOrdered,
  Activity,
  Settings,
  Power,
  Search,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore, dispatchToAllStores } from '../../store/ui-store';

interface PaletteItem {
  id: string;
  label: string;
  category: 'Navigate' | 'Symbols' | 'Actions';
  icon?: any;
  action: () => void;
  danger?: boolean;
}

export function CommandPalette() {
  const isOpen = useUIStore((state) => state.commandPaletteOpen);
  const uiDispatch = useUIStore((state) => state.dispatch);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const closePalette = () => {
    uiDispatch({
      metadata: {
        version: 1,
        eventId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
        timestamp: Date.now(),
      },
      type: 'ui:palette_set',
      payload: { open: false },
    });
  };

  const selectTab = (tabId: string) => {
    dispatchToAllStores({
      metadata: {
        version: 1,
        eventId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
        timestamp: Date.now(),
      },
      type: 'ui:tab_changed',
      payload: { tab: tabId },
    });
    closePalette();
  };

  const selectSymbol = (sym: string) => {
    dispatchToAllStores({
      metadata: {
        version: 1,
        eventId: crypto.randomUUID(),
        correlationId: crypto.randomUUID(),
        timestamp: Date.now(),
      },
      type: 'market:symbol_changed',
      payload: { symbol: sym },
    });
    closePalette();
  };

  const triggerKillSwitch = () => {
    if (confirm('CRITICAL ACTION: Trigger emergency kill switch?')) {
      dispatchToAllStores({
        metadata: {
          version: 1,
          eventId: crypto.randomUUID(),
          correlationId: crypto.randomUUID(),
          timestamp: Date.now(),
        },
        type: 'risk:kill_switch_triggered',
        payload: {},
      });
      closePalette();
    }
  };

  const items: PaletteItem[] = [
    { id: 'nav_dash', label: 'Dashboard', category: 'Navigate', icon: LayoutDashboard, action: () => selectTab('dashboard') },
    { id: 'nav_mkt', label: 'Market', category: 'Navigate', icon: CandlestickChart, action: () => selectTab('market') },
    { id: 'nav_sig', label: 'Signals', category: 'Navigate', icon: Radio, action: () => selectTab('signals') },
    { id: 'nav_port', label: 'Portfolio', category: 'Navigate', icon: Wallet, action: () => selectTab('portfolio') },
    { id: 'nav_ord', label: 'Orders', category: 'Navigate', icon: ListOrdered, action: () => selectTab('orders') },
    { id: 'nav_risk', label: 'Risk', category: 'Navigate', icon: ShieldAlert, action: () => selectTab('risk') },
    { id: 'nav_health', label: 'Health', category: 'Navigate', icon: Activity, action: () => selectTab('health') },
    { id: 'nav_sett', label: 'Settings', category: 'Navigate', icon: Settings, action: () => selectTab('settings') },
    { id: 'sym_btc', label: 'BTC/USD', category: 'Symbols', action: () => selectSymbol('BTC/USD') },
    { id: 'sym_eth', label: 'ETH/USD', category: 'Symbols', action: () => selectSymbol('ETH/USD') },
    { id: 'sym_sol', label: 'SOL/USD', category: 'Symbols', action: () => selectSymbol('SOL/USD') },
    { id: 'sym_aapl', label: 'AAPL', category: 'Symbols', action: () => selectSymbol('AAPL') },
    { id: 'sym_nvda', label: 'NVDA', category: 'Symbols', action: () => selectSymbol('NVDA') },
    { id: 'act_kill', label: 'Engage Kill Switch', category: 'Actions', icon: Power, danger: true, action: triggerKillSwitch },
  ];

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        uiDispatch({
          metadata: {
            version: 1,
            eventId: crypto.randomUUID(),
            correlationId: crypto.randomUUID(),
            timestamp: Date.now(),
          },
          type: 'ui:palette_toggled',
          payload: {},
        });
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        closePalette();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((idx) => (idx + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((idx) => (idx - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, uiDispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 p-4 pt-[15vh] backdrop-blur-xs select-none">
      <div className="w-full max-w-lg overflow-hidden rounded-sm border border-border bg-panel shadow-2xl">
        {/* Search header */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbols, actions, navigation..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent font-mono text-[11px] text-foreground focus:outline-none placeholder-muted-foreground"
          />
          <button onClick={closePalette} className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground hover:bg-accent hover:text-foreground">
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[300px] overflow-y-auto p-1 text-[11px]">
          {filteredItems.length === 0 ? (
            <div className="px-3 py-6 text-center font-mono text-muted-foreground">
              No results found for "{search}"
            </div>
          ) : (
            <div>
              {/* Category groupings */}
              {['Navigate', 'Symbols', 'Actions'].map((cat) => {
                const catItems = filteredItems.filter((i) => i.category === cat);
                if (catItems.length === 0) return null;
                return (
                  <div key={cat} className="mb-2">
                    <div className="px-3.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {cat}
                    </div>
                    {catItems.map((item) => {
                      const absoluteIndex = filteredItems.indexOf(item);
                      const active = selectedIndex === absoluteIndex;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          className={cn(
                            'flex w-full items-center gap-2 px-3.5 py-1.5 text-left font-mono transition-colors rounded-sm',
                            active ? 'bg-accent text-foreground' : 'text-muted-foreground',
                            item.danger && 'text-bear hover:bg-bear/10'
                          )}
                        >
                          {Icon && <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />}
                          <span className={cn('truncate', active ? 'text-foreground' : '')}>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Shortcut Footer info */}
        <div className="flex items-center justify-between border-t border-border px-3 py-1.5 font-mono text-[9px] text-muted-foreground bg-background">
          <div className="flex gap-2.5">
            <span><kbd className="rounded-sm border border-border px-1 bg-panel">↑↓</kbd> navigate</span>
            <span><kbd className="rounded-sm border border-border px-1 bg-panel">↵</kbd> select</span>
            <span><kbd className="rounded-sm border border-border px-1 bg-panel">esc</kbd> close</span>
          </div>
          <span>QUANT.OS · v1.0</span>
        </div>
      </div>
    </div>
  );
}
export default CommandPalette;
