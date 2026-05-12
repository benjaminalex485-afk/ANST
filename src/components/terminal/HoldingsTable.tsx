import { cn } from '../../lib/utils';
import { usePortfolioStore } from '../../store/portfolio-store';

export function HoldingsTable() {
  const positions = usePortfolioStore((state) => state.positions);

  const displayPositions = positions;

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
          {displayPositions.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-12 text-center font-mono text-[10px] text-muted-foreground/40 select-none tracking-widest">
                NO ACTIVE POSITIONS · WAITING FOR EXECUTION
              </td>
            </tr>
          ) : (
            displayPositions.map((p) => {
              const isPos = p.unrealizedPnL >= 0;
              const pnlPct = p.entryPrice > 0 && p.quantity > 0 ? (p.unrealizedPnL / (p.entryPrice * p.quantity)) * 100 : 0;
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
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
export default HoldingsTable;
