import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { useMarketStore } from '../../../store/market-store';

export function MarketChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  
  const activeSymbol = useMarketStore(state => state.activeSymbol);
  const timeframe = useMarketStore(state => state.activeTimeframe);
  const dataBucket = useMarketStore(state => state.candles);
  const latestTick = useMarketStore(state => state.latestTick);

  const cacheKey = `${activeSymbol}_${timeframe}`;
  const candles = dataBucket[cacheKey] || [];

  // --- 1. Instantiation Lifecycle ---
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const initChart = (w: number, h: number) => {
      if (chartRef.current) return;
      if (w <= 0 || h <= 0) return; // Strict geometry guard

      const chart = createChart(container, {
        layout: {
          background: { type: ColorType.Solid, color: '#09090b' }, // Zinc 950
          textColor: '#a1a1aa',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        },
        grid: {
          vertLines: { color: '#18181b' },
          horzLines: { color: '#18181b' },
        },
        width: w,
        height: h,
        timeScale: {
          borderColor: '#27272a',
          timeVisible: true,
          secondsVisible: false,
        },
        rightPriceScale: {
          borderColor: '#27272a',
        },
        crosshair: {
          mode: 1, 
          vertLine: { color: '#52525b', width: 1, style: 3 },
          horzLine: { color: '#52525b', width: 1, style: 3 },
        },
      });

      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;
    };

    // Attempt immediate ignition
    initChart(container.clientWidth, container.clientHeight || 400);

    // Bound ResizeObserver for dynamic synchronization AND late-binding ignition
    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || !entries[0].contentRect) return;
      const { width, height } = entries[0].contentRect;
      
      if (!chartRef.current) {
        initChart(width, height); // Handle ignition if zero-width mount occurred
      } else {
        chartRef.current.applyOptions({ width, height });
      }
    });
    
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
      }
    };
  }, []);

  // --- 2. Full Data Synchronization (Symbol Switches) ---
  useEffect(() => {
    if (!candlestickSeriesRef.current || !candles.length) {
      // Clear if loading or empty
      candlestickSeriesRef.current?.setData([]);
      return;
    }
    
    // Map generic data into TV API Primitives
    const formatted: CandlestickData<Time>[] = candles.map(c => ({
      time: c.time as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    console.log(`[MarketChart] Syncing ${formatted.length} candles for ${activeSymbol}`);
    if (formatted.length > 0) {
      console.log(`[MarketChart] FIRST CANDLE:`, JSON.stringify(formatted[0]));
      console.log(`[MarketChart] LAST CANDLE:`, JSON.stringify(formatted[formatted.length - 1]));
    }

    try {
      candlestickSeriesRef.current.setData(formatted);
      console.log("[MarketChart] setData SUCCESSFUL");
      
      // 🚀 ABSOLUTE BOUNDS ENFORCEMENT: Force the viewport onto the exact coordinates of the data.
      setTimeout(() => {
        if (chartRef.current && formatted.length > 1) {
          const timeScale = chartRef.current.timeScale();
          
          // Get raw exact boundaries from the verification logs
          const firstTime = formatted[0].time as number;
          const lastTime = formatted[formatted.length - 1].time as number;

          // Brute-force explicit pinning of the timeline viewport to guarantee data focus
          timeScale.setVisibleRange({
            from: firstTime,
            to: lastTime,
          });
          
          console.log(`[MarketChart] FORCED VIEWPORT RANGE: From ${firstTime} To ${lastTime}`);
          
          // Final fallback fit just to solidify geometry
          timeScale.fitContent();
        }
      }, 150);

    } catch (err) {
      console.error("[MarketChart] FATAL setData EXCEPTION:", err);
    }

  }, [candles.length, activeSymbol, timeframe]);

  // --- 3. Hot Path Realtime Injection ---
  useEffect(() => {
    // 🛡️ Hydration Guard: DO NOT allow ticks to hit the series BEFORE the base dataset loads.
    // Time-ordering corruption happens if an update precedes a historical setData payload.
    if (!candlestickSeriesRef.current || !latestTick || candles.length < 5) return;

    // Get existing last candle for context
    const lastCandle = candles[candles.length - 1];
    
    try {
      // Determine if tick modifies existing final candle OR forms a fresh closure
      candlestickSeriesRef.current.update({
        time: lastCandle.time as Time,
        open: lastCandle.open,
        high: Math.max(lastCandle.high, latestTick.price),
        low: Math.min(lastCandle.low, latestTick.price),
        close: latestTick.price
      });
    } catch (err) {
      console.warn("[MarketChart] Skipping real-time frame alignment:", err);
    }

  }, [latestTick, candles.length]);

  return (
    <div className="relative h-full w-full flex flex-col min-h-0">
      {/* Embedded Floating Telemetry Indicators */}
      <div className="absolute top-3 left-3 z-10 flex flex-col pointer-events-none">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-bold tracking-tight text-foreground">
            {activeSymbol}
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border border-border bg-panel px-1.5 py-0.5 rounded-sm">
            {timeframe} · SPOT
          </span>
        </div>
        {latestTick && (
          <div className="font-mono text-xl font-bold text-emerald-500 mt-0.5">
            {latestTick.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        )}
      </div>

      {/* Actual TV API Target Node */}
      <div ref={chartContainerRef} className="flex-1 w-full h-full bg-[#09090b]" />
    </div>
  );
}
