/**
 * Standardized dynamic resolution of workstation symbols to valid downstream TradingView routing schemas.
 * Handles crypto slash substitution and implicit routing.
 */
export const getTradingViewSymbol = (sym: string | null): string => {
  if (!sym) return 'NSE:HDFCBANK';
  
  // 1. Already fully qualified explicitly
  if (sym.includes(':')) return sym;
  
  // 2. Handle cryptocurrency and forex pairs (e.g., ETH/USD -> COINBASE:ETHUSD)
  if (sym.includes('/')) {
    const pair = sym.replace('/', '');
    if (pair.startsWith('BTC') || pair.startsWith('ETH')) {
      return `COINBASE:${pair}`;
    }
    return pair; // Fallback lets TradingView do universal search
  }
  
  // 3. Handle standalone tickers. For standalone Indian equities, usually works better passing as is,
  // OR conditionally appending NSE for reliability if it's an Indian symbol.
  // TradingView's internal resolver generally handles 'HDFCBANK' by finding NSE automatically.
  // But let's leave it as is so global assets work too.
  return sym;
};
