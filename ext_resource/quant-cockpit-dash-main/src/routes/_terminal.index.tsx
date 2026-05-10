import { createFileRoute } from '@tanstack/react-router';
import { ChartPanel } from '@/components/terminal/ChartPanel';
import { SignalsPanel } from '@/components/terminal/SignalsPanel';
import { PortfolioPanel } from '@/components/terminal/PortfolioPanel';
import { RiskPanel } from '@/components/terminal/RiskPanel';
import { HealthPanel } from '@/components/terminal/HealthPanel';
import { MetricCard } from '@/components/terminal/MetricCard';
import { usePortfolioStore } from '@/store/portfolio-store';

export const Route = createFileRoute('/_terminal/')({
  head: () => ({
    meta: [
      { title: 'Dashboard — QUANT.OS Terminal' },
      { name: 'description', content: 'Institutional AI-native trading terminal dashboard.' },
      { property: 'og:title', content: 'QUANT.OS Terminal' },
      { property: 'og:description', content: 'Institutional AI-native trading terminal dashboard.' },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const summary = usePortfolioStore((state) => state.summary);

  const equityVal = summary.netAssetValue || 1000000;
  const cashVal = summary.cashBalance || 1000000;
  const pnlVal = summary.totalUnrealizedPnL || 0;

  return (
    <div className="flex h-full flex-col gap-2 min-h-0">
      {/* Dynamic stats row */}
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
        <MetricCard
          label="Realized PnL (24h)"
          value="+$2,418.10"
          tone="bull"
        />
        <MetricCard
          label="Win Rate (7d)"
          value="58.2%"
          delta="142 trades"
          tone="info"
        />
        <MetricCard
          label="Sharpe (30d)"
          value="2.14"
          tone="info"
        />
      </div>

      {/* Grid layouts */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-1.5 lg:grid-cols-12 overflow-y-auto">
        {/* Left section (Hot Path Chart + Portfolio holdings) */}
        <div className="lg:col-span-8 flex flex-col gap-1.5 min-h-[500px]">
          <div className="flex-1 min-h-0">
            <ChartPanel />
          </div>
          <div className="h-60 shrink-0">
            <PortfolioPanel />
          </div>
        </div>

        {/* Right section (AI Signals Feed + Risk boundaries + Subsystems) */}
        <div className="lg:col-span-4 flex flex-col gap-1.5 min-h-[500px]">
          <div className="flex-1 min-h-0">
            <SignalsPanel />
          </div>
          <div className="h-64 shrink-0">
            <RiskPanel />
          </div>
        </div>

        {/* System host health telemetry spanning full row */}
        <div className="lg:col-span-12 shrink-0">
          <HealthPanel />
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;
