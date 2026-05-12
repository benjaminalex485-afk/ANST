import { OrderSide } from '../types/portfolio';

export type CommandType =
  | 'NAVIGATE'
  | 'TOGGLE_SIMULATION'
  | 'RESET_SIMULATION'
  | 'STEP_SIMULATION'
  | 'OPEN_PALETTE'
  | 'CLOSE_PALETTE'
  | 'TOGGLE_LATENCY'
  | 'RESET_LAYOUT'
  | 'FOCUS_PANEL'
  | 'INJECT_SIGNAL'
  | 'TRIGGER_KILL_SWITCH'
  | 'SUBMIT_MOCK_ORDER';

export interface ICommand {
  type: CommandType;
  timestamp: number;
  correlationId: string;
  params?: Record<string, any>;
}

export type CommandHandler = (command: ICommand) => void;
