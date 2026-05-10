export type SignalDirection = 'BUY' | 'SELL' | 'HOLD';
export type MarketRegime = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'VOLATILE';

export interface AISignal {
  id: string;
  symbol: string;
  direction: SignalDirection;
  confidence: number; // 0 to 100
  riskScore: number;  // 0 to 100
  reasoning: string[];
  regime: MarketRegime;
  strategyName: string;
  timestamp: number;
}
