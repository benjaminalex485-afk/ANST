import { create } from 'zustand';
import { AISignal, MarketRegime } from '../types/signal';
import { IEvent } from '../events/types';
import { eventBus } from '../events/event-bus';

interface SignalState {
  signals: AISignal[];
  currentRegime: MarketRegime;
  dispatch: (event: IEvent) => void;
}

export const useSignalStore = create<SignalState>((set) => ({
  signals: [],
  currentRegime: 'NEUTRAL',

  dispatch: (event: IEvent) => {
    switch (event.type) {
      case 'signal:generated':
        set((state) => ({
          signals: [event.payload, ...state.signals].slice(0, 50),
        }));
        break;
      case 'signal:regime_changed':
        set({ currentRegime: event.payload.regime });
        break;
      case 'signal:clear':
        set({ signals: [] });
        break;
    }
  },
}));

eventBus.subscribe('signal:*', (event) => useSignalStore.getState().dispatch(event));
