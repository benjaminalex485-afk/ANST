import { create } from 'zustand';
import { IEvent } from '../events/types';
import { eventBus } from '../events/event-bus';

export interface PanelConfig {
  id: string;
  title: string;
  visible: boolean;
  w: number; // grid columns
  h: number; // grid rows
}

interface LayoutState {
  panels: PanelConfig[];
  dispatch: (event: IEvent) => void;
}

const DEFAULT_PANELS: PanelConfig[] = [
  { id: 'chart', title: 'Live Market Chart', visible: true, w: 8, h: 6 },
  { id: 'signals', title: 'AI Trade Signals', visible: true, w: 4, h: 6 },
  { id: 'portfolio', title: 'Positions & Ledger', visible: true, w: 6, h: 4 },
  { id: 'risk', title: 'Quantitative Risk Monitor', visible: true, w: 3, h: 4 },
  { id: 'health', title: 'Telemetry & Health', visible: true, w: 3, h: 4 },
];

export const useLayoutStore = create<LayoutState>((set) => {
  // Load initial from localStorage if on browser
  let initialPanels = DEFAULT_PANELS;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('anst_layout_panels');
      if (stored) {
        initialPanels = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse layout configs from localStorage:', e);
    }
  }

  return {
    panels: initialPanels,

    dispatch: (event: IEvent) => {
      switch (event.type) {
        case 'layout:toggle_panel':
          set((state) => {
            const next = state.panels.map((p) =>
              p.id === event.payload.id ? { ...p, visible: !p.visible } : p
            );
            if (typeof window !== 'undefined') {
              localStorage.setItem('anst_layout_panels', JSON.stringify(next));
            }
            return { panels: next };
          });
          break;
        case 'layout:resize_panel':
          set((state) => {
            const { id, w, h } = event.payload;
            const next = state.panels.map((p) => (p.id === id ? { ...p, w, h } : p));
            if (typeof window !== 'undefined') {
              localStorage.setItem('anst_layout_panels', JSON.stringify(next));
            }
            return { panels: next };
          });
          break;
        case 'layout:reset':
          set(() => {
            if (typeof window !== 'undefined') {
              localStorage.setItem('anst_layout_panels', JSON.stringify(DEFAULT_PANELS));
            }
            return { panels: DEFAULT_PANELS };
          });
          break;
      }
    },
  };
});

eventBus.subscribe('layout:*', (event) => useLayoutStore.getState().dispatch(event), 'store:layout');
