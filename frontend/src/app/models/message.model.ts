import { MessageType } from '../constants/game-constants';

export interface GameMessage {
  text: string;
  type: MessageType;
  displayTime: number;
}
