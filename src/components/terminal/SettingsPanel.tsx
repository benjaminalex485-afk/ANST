import { Settings, Key, Activity, Database, Save, Trash2, RefreshCw, Wallet, DollarSign } from 'lucide-react';
import { useSettingsStore } from '../../store/settings-store';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { TerminalPanel } from './TerminalPanel';
import { eventBus } from '../../events/event-bus';
import { TimeAuthority } from '../../services/time-authority';

export function SettingsPanel() {
  const { 
    twelveDataApiKey, 
    setTwelveDataApiKey, 
    enableSimulation, 
    setEnableSimulation,
    startingCapital,
    setStartingCapital
  } = useSettingsStore();

  const [keyInput, setKeyInput] = useState(twelveDataApiKey);
  const [capitalInput, setCapitalInput] = useState(startingCapital.toString());
  
  const [saveMessage, setSaveMessage] = useState('');
  const [capitalMessage, setCapitalMessage] = useState('');

  const handleSaveKeys = () => {
    setTwelveDataApiKey(keyInput);
    setSaveMessage('Configuration saved to runtime cache.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleApplyCapital = () => {
    const val = parseFloat(capitalInput) || 0;
    setStartingCapital(val);
    
    // Physically broadcast the command to the Portfolio store to wipe everything and set this value
    eventBus.publish({
      metadata: { version: 1, eventId: crypto.randomUUID(), correlationId: 'manual_capital_reset', timestamp: TimeAuthority.now() },
      type: 'portfolio:reset',
      payload: { initialCash: val }
    });

    setCapitalMessage(`Account balance effectively reset to $${val.toLocaleString()}.`);
    setTimeout(() => setCapitalMessage(''), 4000);
  };

  const handleClearStorage = () => {
    if (confirm("Are you absolutely sure you want to clear all local data? This will reset your watchlist, configuration and requires a browser reload.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 py-4">
      <div className="flex items-center gap-3 mb-2 select-none">
        <Settings className="w-5 h-5 text-primary" />
        <h1 className="font-mono text-lg font-bold uppercase tracking-widest text-foreground">
          System Configuration
        </h1>
      </div>

      {/* 1. Data Connectors */}
      <TerminalPanel title="Data Providers" subtitle="Remote Market Connectivity API Access">
        <div className="p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] font-mono text-foreground font-semibold">
              <Key className="w-3.5 h-3.5 text-muted-foreground" />
              Twelve Data API Key
            </div>
            <p className="text-[10px] text-muted-foreground -mt-1 leading-relaxed">
              Required for global markets data integration. Key is persisted encrypted in your browser local store only.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="flex-1 bg-background border border-border rounded-sm px-3 py-2 font-mono text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Enter your API key..."
              />
              <button
                onClick={handleSaveKeys}
                className="px-3 py-2 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 rounded-sm font-mono text-[10px] font-bold tracking-wide uppercase flex items-center gap-2 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Commit
              </button>
            </div>
            {saveMessage && (
              <div className="text-[9px] font-mono text-emerald-500 animate-pulse mt-1">
                {saveMessage}
              </div>
            )}
          </div>
        </div>
      </TerminalPanel>

      {/* 2. Account Configuration */}
      <TerminalPanel title="Account Governance" subtitle="Operational Capital Allocation">
        <div className="p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[11px] font-mono text-foreground font-semibold">
              <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
              Initial Cash Balance
            </div>
            <p className="text-[10px] text-muted-foreground -mt-1 leading-relaxed">
              Explicit declaration of starting equity. Modifying this will purge current position data and re-anchor liquidity.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-2.5 w-3 h-3 text-muted-foreground" />
                <input
                  type="number"
                  value={capitalInput}
                  onChange={(e) => setCapitalInput(e.target.value)}
                  className="w-full bg-background border border-border rounded-sm pl-7 pr-3 py-2 font-mono text-[11px] text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="100000"
                />
              </div>
              <button
                onClick={handleApplyCapital}
                className="px-3 py-2 bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 rounded-sm font-mono text-[10px] font-bold tracking-wide uppercase flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Synchronize
              </button>
            </div>
            {capitalMessage && (
              <div className="text-[9px] font-mono text-emerald-500 animate-pulse mt-1">
                {capitalMessage}
              </div>
            )}
          </div>
        </div>
      </TerminalPanel>

      {/* 2. Runtime Simulation Toggle */}
      <TerminalPanel title="Core Runtime" subtitle="Background Engine Orchestration">
        <div className="p-4">
          <div className="flex items-center justify-between border border-border bg-panel-elevated/30 p-3 rounded-sm">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-foreground">
                <Activity className="w-3.5 h-3.5 text-primary" />
                Simulation Engine
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed max-w-md">
                When disabled, system bypasses random-walk algorithms and executes in pure real-world stream mode. Disabling this stops all mock ticks and synthetic noise.
              </p>
            </div>
            
            <button
              onClick={() => setEnableSimulation(!enableSimulation)}
              className={cn(
                "relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                enableSimulation ? "bg-bull" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none block h-3.5 w-3.5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                  enableSimulation ? "translate-x-5" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
        </div>
      </TerminalPanel>

      {/* 3. Nuclear Options */}
      <TerminalPanel title="Danger Zone" subtitle="System Reset Protocols">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-destructive/20 bg-destructive/5 p-3 rounded-sm flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-destructive uppercase tracking-wide">
                <Trash2 className="w-3.5 h-3.5" />
                Purge All Storage
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">
                Irreversibly destroys watchlist, settings caches, and logs currently residing in browser RAM and Storage.
              </p>
            </div>
            <button
              onClick={handleClearStorage}
              className="mt-auto w-fit px-3 py-1.5 border border-destructive/40 text-destructive hover:bg-destructive/10 font-mono text-[9px] uppercase rounded-sm transition-colors"
            >
              Execute Factory Reset
            </button>
          </div>

          <div className="border border-border bg-panel-elevated/20 p-3 rounded-sm flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-foreground uppercase tracking-wide">
                <RefreshCw className="w-3.5 h-3.5" />
                Full State Reload
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">
                Forces hard runtime re-mount without clearing config. Fixes dangling memory leaks or stalled websocket channels.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-auto w-fit px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground hover:bg-accent font-mono text-[9px] uppercase rounded-sm transition-colors"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      </TerminalPanel>
    </div>
  );
}
