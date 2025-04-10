import { GameMessage } from './message.model';

export interface MessageProvider {
  getMessage(): string;
}

export interface GameMessageProvider {
  showMessage(message: GameMessage): void;
}
