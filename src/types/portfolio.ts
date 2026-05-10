export interface Position {
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  allocationPercent: number;
  timestamp: number;
}

export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  price: number;
  status: OrderStatus;
  timestamp: number;
}

export interface PortfolioSummary {
  netAssetValue: number;
  cashBalance: number;
  totalUnrealizedPnL: number;
  totalRealizedPnL: number;
}
