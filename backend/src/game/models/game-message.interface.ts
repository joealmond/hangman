import { MessageType } from './message-type.enum';

export interface GameMessage {
  text: string;
  type: MessageType;
  displayTime: number;
}
