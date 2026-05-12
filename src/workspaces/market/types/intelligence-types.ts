export interface IntelligenceQuote {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  previous_close: number;
  fifty_two_week: {
    low: number;
    high: number;
  };
  percent_change: number;
}

export interface PivotPoints {
  p: number;
  r1: number;
  r2: number;
  r3: number;
  s1: number;
  s2: number;
  s3: number;
}

export interface IndicatorValue {
  value: number;
  verdict: 'Bullish' | 'Bearish' | 'Neutral' | 'Strong Bullish' | 'Strong Bearish';
}

export interface MovingAverageItem {
  period: string;
  ma: number;
  ema: number;
}

export interface FundamentalStats {
  marketCap: number;
  trailingPE: number;
  forwardPE: number;
  eps: number;
  roe: number;
  bookValue: number;
  debtToEquity: number;
  insiderHoldings: number;
  institutionalHoldings: number;
  revenueTTM: number;
  netIncomeTTM: number;
  avg10Volume: number;
  avg90Volume: number;
}

export interface SymbolIntelligence {
  quote: IntelligenceQuote | null;
  pivots: PivotPoints | null;
  stats: FundamentalStats | null;
  indicators: {
    rsi: IndicatorValue | null;
    macd: { macd: number; signal: number; hist: number; verdict: string } | null;
    adx: number | null;
  };
  movingAverages: MovingAverageItem[];
  loading: boolean;
  error: string | null;
}
