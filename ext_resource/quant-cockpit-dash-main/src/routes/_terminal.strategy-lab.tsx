import { createFileRoute } from "@tanstack/react-router";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";

const strategies = [
  { name: "MACD-XOver", status: "RUNNING", sharpe: 1.84, winRate: 56, trades: 412 },
  { name: "MeanReversion-v2", status: "RUNNING", sharpe: 2.21, winRate: 61, trades: 298 },
  { name: "VolBreakdown", status: "PAUSED", sharpe: 1.12, winRate: 49, trades: 184 },
  { name: "Ensemble-v3", status: "RUNNING", sharpe: 2.78, winRate: 64, trades: 521 },
  { name: "RegimeShift", status: "BACKTEST", sharpe: 1.55, winRate: 53, trades: 90 },
];

export const Route = createFileRoute("/_terminal/strategy-lab")({
  head: () => ({
    meta: [
      { title: "Strategy Lab — QUANT.OS Terminal" },
      { name: "description", content: "Strategy backtests, deployments, and performance." },
    ],
  }),
  component: () => (
    <div className="h-full">
      <TerminalPanel title="Strategy Lab" subtitle={`${strategies.length} strategies`} scroll>
        <table className="w-full font-mono text-[11px]">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-2.5 py-1.5 text-left">Strategy</th>
              <th className="px-2.5 py-1.5 text-left">Status</th>
              <th className="px-2.5 py-1.5 text-right">Sharpe</th>
              <th className="px-2.5 py-1.5 text-right">Win %</th>
              <th className="px-2.5 py-1.5 text-right">Trades</th>
            </tr>
          </thead>
          <tbody>
            {strategies.map((s) => (
              <tr key={s.name} className="border-b border-grid-line hover:bg-panel-elevated">
                <td className="px-2.5 py-1.5 font-semibold">{s.name}</td>
                <td className="px-2.5 py-1.5 text-muted-foreground">{s.status}</td>
                <td className="tnum px-2.5 py-1.5 text-right">{s.sharpe.toFixed(2)}</td>
                <td className="tnum px-2.5 py-1.5 text-right">{s.winRate}%</td>
                <td className="tnum px-2.5 py-1.5 text-right">{s.trades}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TerminalPanel>
    </div>
  ),
});
