import { useEffect } from 'react';
import Sidebar from '../components/terminal/Sidebar';
import Topbar from '../components/terminal/Topbar';
import ChartPanel from '../components/terminal/ChartPanel';
import SignalsPanel from '../components/terminal/SignalsPanel';
import PortfolioPanel from '../components/terminal/PortfolioPanel';
import RiskPanel from '../components/terminal/RiskPanel';
import HealthPanel from '../components/terminal/HealthPanel';
import MetricCard from '../components/terminal/MetricCard';
import CommandPalette from '../components/terminal/CommandPalette';
import { simulationEngine } from '../services/engines/simulation-engine';
import { usePortfolioStore } from '../store/portfolio-store';
import { useUIStore } from '../store/ui-store';

export function TerminalWorkstation() {
  const summary = usePortfolioStore((state) => state.summary);
  const activeTab = useUIStore((state) => state.activeTab);

  // Spin up simulated real-time pricing ticks on workstation mount
  useEffect(() => {
    simulationEngine.start();
    return () => {
      simulationEngine.stop();
    };
  }, []);

  const equityVal = summary.netAssetValue || 1000000;
  const cashVal = summary.cashBalance || 1000000;
  const pnlVal = summary.totalUnrealizedPnL || 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground select-none">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main workspace area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top telemetry bar */}
        <Topbar />

        {/* Dynamic Workstation Views */}
        <main className="flex-1 overflow-y-auto p-2 flex flex-col min-h-0 relative">
          {activeTab === 'dashboard' && (
            <div className="flex h-full flex-col gap-2 min-h-0 animate-in fade-in duration-200">
              {/* Dynamic metric stats row */}
              <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 lg:grid-cols-6 shrink-0">
                <MetricCard
                  label="Equity"
                  value={`$${equityVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  delta={`${pnlVal >= 0 ? '+' : ''}${pnlVal.toLocaleString(undefined, { maximumFractionDigits: 0 })} today`}
                  tone={pnlVal >= 0 ? 'bull' : 'bear'}
                />
                <MetricCard
                  label="Cash Balance"
                  value={`$${cashVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  tone="neutral"
                />
                <MetricCard
                  label="Open PnL"
                  value={`${pnlVal >= 0 ? '+' : ''}$${pnlVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  delta="4 active holdings"
                  tone={pnlVal >= 0 ? 'bull' : 'bear'}
                />
                <MetricCard label="Realized PnL (24h)" value="+$2,418.10" tone="bull" />
                <MetricCard label="Win Rate (7d)" value="58.2%" delta="142 trades" tone="info" />
                <MetricCard label="Sharpe (30d)" value="2.14" tone="info" />
              </div>

              {/* Main dashboard panel grid layout */}
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-1.5 lg:grid-cols-12 overflow-y-auto">
                <div className="lg:col-span-8 flex flex-col gap-1.5 min-h-[500px]">
                  <div className="flex-1 min-h-0"><ChartPanel /></div>
                  <div className="h-60 shrink-0"><PortfolioPanel /></div>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-1.5 min-h-[500px]">
                  <div className="flex-1 min-h-0"><SignalsPanel /></div>
                  <div className="h-64 shrink-0"><RiskPanel /></div>
                </div>
                <div className="lg:col-span-12 shrink-0"><HealthPanel /></div>
              </div>
            </div>
          )}

          {activeTab === 'market' && (
            <div className="flex h-full flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="flex-1 min-h-0"><ChartPanel /></div>
            </div>
          )}

          {activeTab === 'signals' && (
            <div className="flex h-full flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="flex-1 min-h-0"><SignalsPanel /></div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="flex h-full flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="flex-1 min-h-0"><PortfolioPanel /></div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="flex h-full flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="flex-1 min-h-0"><RiskPanel /></div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="flex h-full flex-col gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="flex-1 min-h-0"><HealthPanel /></div>
            </div>
          )}

          {/* Fallback for fully scaffolded empty placeholders (Strategy Lab, Orders, etc) */}
          {!['dashboard', 'market', 'signals', 'portfolio', 'risk', 'health'].includes(activeTab) && (
            <div className="flex h-full flex-col items-center justify-center rounded-sm border border-border bg-panel animate-in zoom-in-95 duration-200 text-center p-8">
              <div className="h-12 w-12 rounded-full border border-border bg-background flex items-center justify-center mb-4">
                <span className="h-2 w-2 bg-primary rounded-full animate-ping" />
              </div>
              <h2 className="font-mono text-sm font-semibold text-foreground uppercase tracking-widest mb-2">
                {activeTab.replace('-', ' ')} Module
              </h2>
              <p className="font-mono text-[10px] text-muted-foreground max-w-md leading-relaxed">
                AWAITING DOMAIN ORCHESTRATION CONTRACTS
                <br/>
                <span className="opacity-50">Initializing core state buckets for sub-component rendering...</span>
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Custom CommandPalette menu */}
      <CommandPalette />
    </div>
  );
}

export default TerminalWorkstation;
