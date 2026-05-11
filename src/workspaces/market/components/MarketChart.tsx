import React, { useEffect, useRef, memo } from 'react';
import { CandlestickChart } from 'lucide-react';
import { useMarketStore } from '../../../store/market-store';

export const MarketChart = memo(() => {
  const container = useRef<HTMLDivElement>(null);
  const activeSymbol = useMarketStore(state => state.activeSymbol);
  const timeframe = useMarketStore(state => state.activeTimeframe);

  // Smart Engine: Map local timeframe tokens to explicit TradingView widget contract expectations
  const getTVInterval = (tf: string) => {
    const lower = tf.toLowerCase();
    if (lower === '1m') return '1';
    if (lower === '5m') return '5';
    if (lower === '15m') return '15';
    if (lower === '30m') return '30';
    if (lower === '1h') return '60';
    if (lower === '4h') return '240';
    if (lower === '1d') return 'D';
    if (tf === '1M') return 'M'; // Upper case check retained
    return 'D';
  };

  // Smart Sanitizer: Clean format to optimize TV dynamic routing hit-rates
  const getTVSymbol = (sym: string) => {
    if (!sym) return 'NASDAQ:AAPL';
    // 1. If explicitly formatted as EXCHANGE:SYMBOL, pass unmutated
    if (sym.includes(':')) return sym;
    // 2. Handle slash-separated pairs like BTC/USD -> BINANCE:BTCUSDT or BITSTAMP:BTCUSD
    if (sym.includes('/')) {
      const pair = sym.replace('/', '');
      if (pair.startsWith('BTC') || pair.startsWith('ETH')) {
        return `COINBASE:${pair}`;
      }
      return pair;
    }
    return sym;
  };

  useEffect(() => {
    if (!activeSymbol || !container.current) return;

    // 🛡️ Cleansing Cycle: Physically evacuate DOM artifacts before remounting engine instance.
    container.current.innerHTML = ''; 
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    // Massive Payload Constructor for the Pro Engine configuration
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": getTVSymbol(activeSymbol),
      "interval": getTVInterval(timeframe),
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_top_toolbar": false, // Keep this on for drawing tool visibility
      "allow_symbol_change": true,
      "save_image": true,
      "backgroundColor": "rgba(9, 9, 11, 1)", // Match zinc-950 theme
      "gridColor": "rgba(39, 39, 42, 0.3)",
      "calendar": false,
      "hide_volume": false,
      "support_host": "https://www.tradingview.com",
      // 🚀 Physical Drawing Tools Activation Package
      "toolbar_bg": "#18181b",
      "withdateranges": true,
      "drawings_access": {
        "type": "black",
        "tools": [
          { "name": "Trend Line" },
          { "name": "Horizontal Line" },
          { "name": "Fib Retracement" },
          { "name": "Rectangle" }
        ]
      },
      "studies": []
    });

    container.current.appendChild(script);
    
    return () => {
      // Context guard
      if (container.current) container.current.innerHTML = '';
    };
  }, [activeSymbol, timeframe]); // Hot reload engine trigger on context shift

  if (!activeSymbol) {
    return (
      <div className="absolute inset-0 z-20 bg-[#09090b] flex flex-col items-center justify-center select-none">
        <div className="flex flex-col items-center text-muted-foreground/40">
          <CandlestickChart className="w-12 h-12 mb-3 stroke-[1.5]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold">Terminal Canvas Dormant</span>
          <span className="font-mono text-[9px] mt-2 opacity-70">Add assets to active cache to engage physical visualization.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tradingview-widget-container w-full h-full min-h-0 flex flex-col relative" style={{ height: '100%' }}>
      <div 
        id="tradingview_host"
        ref={container} 
        className="w-full flex-1 min-h-0 border-0" 
        style={{ height: '100%' }}
      />
    </div>
  );
});

MarketChart.displayName = 'MarketChart';
