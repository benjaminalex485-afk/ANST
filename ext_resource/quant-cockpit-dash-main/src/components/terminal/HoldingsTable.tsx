import { cn } from '../../lib/utils';
import { usePortfolioStore } from '../../store/portfolio-store';

export function HoldingsTable() {
  const positions = usePortfolioStore((state) => state.positions);

  // Fallback default positions for demonstration before the simulation starts
  const displayPositions = positions.length > 0 ? positions : [
    { symbol: 'BTC/USD', quantity: 0.842, entryPrice: 64210, currentPrice: 67842, unrealizedPnL: 3057.34, realizedPnL: 0, allocationPercent: 32, timestamp: Date.now() },
    { symbol: 'ETH/USD', quantity: 12.5, entryPrice: 3420, currentPrice: 3512, unrealizedPnL: 1150.0, realizedPnL: 0, allocationPercent: 21, timestamp: Date.now() },
    { symbol: 'SOL/USD', quantity: 180, entryPrice: 162.4, currentPrice: 158.1, unrealizedPnL: -774.0, realizedPnL: 0, allocationPercent: 14, timestamp: Date.now() },
    { symbol: 'AAPL', quantity: 35, entryPrice: 118.2, currentPrice: 124.6, unrealizedPnL: 224.0, realizedPnL: 0, allocationPercent: 12, timestamp: Date.now() },
  ];

  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full border-collapse font-mono text-[10px]">
        <thead className="sticky top-0 bg-panel border-b border-border z-10 select-none">
          <tr className="text-left text-[9px] uppercase tracking-wider text-muted-foreground">
            <th className="px-2.5 py-1.5 font-medium">Symbol</th>
            <th className="px-2.5 py-1.5 text-right font-medium">Position</th>
            <th className="px-2.5 py-1.5 text-right font-medium">Entry</th>
            <th className="px-2.5 py-1.5 text-right font-medium">Current</th>
            <th className="px-2.5 py-1.5 text-right font-medium">PnL (Unrealized)</th>
            <th className="px-2.5 py-1.5 text-right font-medium">Alloc %</th>
          </tr>
        </thead>
        <tbody>
          {displayPositions.map((p) => {
            const isPos = p.unrealizedPnL >= 0;
            const pnlPct = (p.unrealizedPnL / (p.entryPrice * p.quantity)) * 100;
            return (
              <tr
                key={p.symbol}
                className="border-b border-grid-line hover:bg-panel-elevated transition-colors"
              >
                <td className="px-2.5 py-1.5 font-semibold text-foreground">
                  {p.symbol}
                </td>
                <td className="tnum px-2.5 py-1.5 text-right text-foreground">
                  {p.quantity.toLocaleString(undefined, { maximumFractionDigits: 3 })}
                </td>
                <td className="tnum px-2.5 py-1.5 text-right text-muted-foreground">
                  {p.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="tnum px-2.5 py-1.5 text-right text-foreground">
                  {p.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td
                  className={cn(
                    'tnum px-2.5 py-1.5 text-right font-medium',
                    isPos ? 'text-bull' : 'text-bear'
                  )}
                >
                  {isPos ? '+' : ''}
                  {p.unrealizedPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                  <span className="text-[9px] opacity-80 font-normal">
                    ({isPos ? '+' : ''}
                    {pnlPct.toFixed(2)}%)
                  </span>
                </td>
                <td className="px-2.5 py-1.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className="h-1 w-10 overflow-hidden rounded-sm bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${p.allocationPercent}%` }}
                      />
                    </div>
                    <span className="tnum w-6 text-right text-muted-foreground text-[9px]">
                      {p.allocationPercent}%
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default HoldingsTable;
