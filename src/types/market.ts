export interface NormalizedTick {
  symbol: string;
  price: number;
  volume: number;
  bid: number;
  ask: number;
  timestamp: number;
  exchange: string;
}

export interface Candle {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface IndicatorResult {
  sma?: number;
  ema?: number;
  rsi?: number;
  bbUpper?: number;
  bbMiddle?: number;
  bbLower?: number;
  vma?: number;
}

export interface FullCandle extends Candle {
  indicators?: IndicatorResult;
}
