import { create } from 'zustand';
import { SystemHealth } from '../types/health';
import { IEvent } from '../events/types';
import { eventBus } from '../events/event-bus';

interface HealthState {
  health: SystemHealth;
  dispatch: (event: IEvent) => void;
}

export const useHealthStore = create<HealthState>((set) => ({
  health: {
    wsLatency: 0,
    apiLatency: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    brokerConnected: true,
    dbHealth: true,
    inferenceLatency: 0,
    queueDepth: 0,
  },

  dispatch: (event: IEvent) => {
    switch (event.type) {
      case 'health:metrics_updated':
        set({ health: event.payload });
        break;
      case 'health:broker_connection_changed':
        set((state) => ({
          health: { ...state.health, brokerConnected: event.payload.connected },
        }));
        break;
    }
  },
}));

eventBus.subscribe('health:*', (event) => useHealthStore.getState().dispatch(event), 'store:health');
