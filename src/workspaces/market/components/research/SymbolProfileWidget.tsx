import React, { useEffect, useRef } from 'react';
import { useMarketStore } from '../../../../store/market-store';
import { getTradingViewSymbol } from '../../../../lib/tradingview';

export const SymbolProfileWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSymbol = useMarketStore((state) => state.activeSymbol);

  useEffect(() => {
    if (!containerRef.current || !activeSymbol) return;

    // Purge residual iframe scripts to prevent overlapping
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: '100%',
      colorTheme: 'dark',
      isTransparent: true,
      symbol: getTradingViewSymbol(activeSymbol),
      locale: 'en',
    });

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    containerRef.current.appendChild(widgetContainer);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [activeSymbol]);

  return (
    <div className="tradingview-widget-container w-full h-full min-h-[350px]" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};
