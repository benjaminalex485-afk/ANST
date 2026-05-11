import { eventBus } from '../../events/event-bus';
import { TimeAuthority } from '../time-authority';
import { useMarketStore } from '../../store/market-store';
import { usePortfolioStore } from '../../store/portfolio-store';
import { useRiskStore } from '../../store/risk-store';
import { useHealthStore } from '../../store/health-store';
import { useSignalStore } from '../../store/signal-store';

class SimulationEngine {
  private intervalId: any = null;
  private prices: Record<string, number> = {
    'BTC/USD': 64320.5,
    'ETH/USD': 3480.2,
    'SOL/USD': 158.4,
    'AAPL': 224.5,
    'NVDA': 122.8,
  };

  public start(): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.tick();
    }, 250); // Tick at 4Hz (Warm Path batching budget)
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick(): void {
    const isKillSwitched = useRiskStore.getState().killSwitchTriggered;
    if (isKillSwitched) {
      this.stop();
      return;
    }

    const activeSymbol = useMarketStore.getState().activeSymbol;
    const timestamp = TimeAuthority.now();

    // 1. Update prices with GBM (Geometric Brownian Motion) random walk
    Object.keys(this.prices).forEach((sym) => {
      // 🛡️ FEED COLLISION GUARD: Do not simulate ticks for the actively selected Live Market symbol.
      // This guarantees data purity and prevents random walk injections from flickering the real dataset.
      if (sym === activeSymbol) return;

      const price = this.prices[sym];
      const changePercent = (Math.random() - 0.495) * 0.001; 
      const nextPrice = price * (1 + changePercent);
      this.prices[sym] = nextPrice;

      // Broadcast high-speed tick
      const tickEvent = {
        metadata: {
          version: 1,
          eventId: crypto.randomUUID(),
          correlationId: crypto.randomUUID(),
          timestamp,
        },
        type: 'market:tick',
        payload: {
          symbol: sym,
          price: nextPrice,
          volume: Math.floor(Math.random() * 50) + 10,
          bid: nextPrice - 0.05,
          ask: nextPrice + 0.05,
          timestamp,
          exchange: 'SIMULATOR',
        },
      };
      eventBus.publish(tickEvent);
    });

    // 2. Drive portfolio unrealized PnL updates
    const portfolioStore = usePortfolioStore.getState();
    if (portfolioStore.positions.length > 0) {
      let totalUnrealizedPnL = 0;
      const nextPositions = portfolioStore.positions.map((pos) => {
        const livePrice = this.prices[pos.symbol] || pos.currentPrice;
        const unrealizedPnL = (livePrice - pos.entryPrice) * pos.quantity;
        totalUnrealizedPnL += unrealizedPnL;
        return {
          ...pos,
          currentPrice: livePrice,
          unrealizedPnL,
        };
      });

      const nextNetAssetValue = portfolioStore.summary.cashBalance + totalUnrealizedPnL;
      
      eventBus.publish({
        metadata: { version: 1, eventId: crypto.randomUUID(), correlationId: crypto.randomUUID(), timestamp },
        type: 'portfolio:positions_updated',
        payload: nextPositions,
      });

      eventBus.publish({
        metadata: { version: 1, eventId: crypto.randomUUID(), correlationId: crypto.randomUUID(), timestamp },
        type: 'portfolio:summary_updated',
        payload: {
          netAssetValue: nextNetAssetValue,
          cashBalance: portfolioStore.summary.cashBalance,
          totalUnrealizedPnL,
          totalRealizedPnL: portfolioStore.summary.totalRealizedPnL,
        },
      });

      // Update Risk Metrics
      eventBus.publish({
        metadata: { version: 1, eventId: crypto.randomUUID(), correlationId: crypto.randomUUID(), timestamp },
        type: 'risk:metrics_updated',
        payload: {
          exposure: nextPositions.reduce((acc, p) => acc + (p.currentPrice * p.quantity), 0),
          leverage: Math.max(1.0, nextPositions.reduce((acc, p) => acc + (p.currentPrice * p.quantity), 0) / nextNetAssetValue),
          drawdown: Math.min(0, (totalUnrealizedPnL / nextNetAssetValue) * 100),
          valueAtRisk: Math.abs(totalUnrealizedPnL * 0.15),
          riskUtilization: Math.min(100, (Math.abs(totalUnrealizedPnL) / 50000) * 100),
        },
      });
    }

    // 3. [AI Signals generation deactivated]
    // Physical strategy integration pending.

    // 4. Update System Health Subsystem telemetry
    eventBus.publish({
      metadata: { version: 1, eventId: crypto.randomUUID(), correlationId: crypto.randomUUID(), timestamp },
      type: 'health:metrics_updated',
      payload: {
        wsLatency: Math.floor(Math.random() * 8) + 8,
        apiLatency: Math.floor(Math.random() * 15) + 10,
        cpuUsage: 30 + Math.random() * 20,
        memoryUsage: 55 + Math.random() * 5,
        brokerConnected: true,
        dbHealth: true,
        inferenceLatency: 0.5 + Math.random() * 0.5,
        queueDepth: Math.floor(Math.random() * 4),
      },
    });
  }
}

export const simulationEngine = new SimulationEngine();
