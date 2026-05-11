import { TerminalPanel } from './TerminalPanel';
import { HoldingsTable } from './HoldingsTable';
import { StatusBadge } from './StatusBadge';
import { usePortfolioStore } from '../../store/portfolio-store';

export function PortfolioPanel() {
  const summary = usePortfolioStore((state) => state.summary);
  const positions = usePortfolioStore((state) => state.positions);

  const navVal = summary.netAssetValue;
  const pnlVal = summary.totalUnrealizedPnL;
  const posCount = positions.length;

  return (
    <TerminalPanel
      title="Portfolio"
      subtitle={`${posCount} positions · $${navVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      actions={
        <StatusBadge variant={pnlVal >= 0 ? 'bull' : 'bear'}>
          {pnlVal >= 0 ? '+' : ''}${pnlVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PnL
        </StatusBadge>
      }
      scroll
    >
      <HoldingsTable />
    </TerminalPanel>
  );
}
export default PortfolioPanel;
