import { create } from 'zustand';
import { IEvent } from '../events/types';
import { eventBus } from '../events/event-bus';

interface RiskMetrics {
  exposure: number;
  leverage: number;
  drawdown: number;
  valueAtRisk: number;
  riskUtilization: number;
}

interface RiskState {
  metrics: RiskMetrics;
  killSwitchTriggered: boolean;
  dispatch: (event: IEvent) => void;
}

export const useRiskStore = create<RiskState>((set) => ({
  metrics: {
    exposure: 0,
    leverage: 1.0,
    drawdown: 0.0,
    valueAtRisk: 0,
    riskUtilization: 0.0,
  },
  killSwitchTriggered: false,

  dispatch: (event: IEvent) => {
    switch (event.type) {
      case 'risk:metrics_updated':
        set({ metrics: event.payload });
        break;
      case 'risk:kill_switch_triggered':
        set({ killSwitchTriggered: true });
        break;
      case 'risk:reset':
        set({
          metrics: {
            exposure: 0,
            leverage: 1.0,
            drawdown: 0.0,
            valueAtRisk: 0,
            riskUtilization: 0.0,
          },
          killSwitchTriggered: false,
        });
        break;
    }
  },
}));

eventBus.subscribe('risk:*', (event) => useRiskStore.getState().dispatch(event), 'store:risk');
