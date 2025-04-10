import { Injectable } from '@nestjs/common';
import { GameMessage } from '../models/game-message.interface';
import { MessageType } from '../models/message-type.enum';

@Injectable()
export class MessageService {
  private readonly displayTimes: Record<MessageType, number> = {
    [MessageType.INFO]: 1500,
    [MessageType.ERROR]: 2000,
    [MessageType.WON]: 0,
    [MessageType.LOST]: 0,
    [MessageType.PLACEHOLDER]: 0,
  };

  getPlaceholderMessage(): GameMessage {
    return {
      text: 'Waiting for input...',
      type: MessageType.PLACEHOLDER,
      displayTime: this.displayTimes[MessageType.PLACEHOLDER],
    };
  }

  getVictoryMessage(): GameMessage {
    return {
      text: 'Congratulations! You won!',
      type: MessageType.WON,
      displayTime: this.displayTimes[MessageType.WON],
    };
  }

  getGameOverMessage(word: string): GameMessage {
    return {
      text: `Game Over! The word was: "${word}"`,
      type: MessageType.LOST,
      displayTime: this.displayTimes[MessageType.LOST],
    };
  }

  getGuessInfoMessage(letter: string): GameMessage {
    return {
      text: `You pressed: "${letter}"`,
      type: MessageType.INFO,
      displayTime: this.displayTimes[MessageType.INFO],
    };
  }

  getInvalidGuessMessage(): GameMessage {
    return {
      text: 'Invalid guess. Please enter a single letter.',
      type: MessageType.ERROR,
      displayTime: this.displayTimes[MessageType.ERROR],
    };
  }

  getAlreadyGuessedMessage(): GameMessage {
    return {
      text: 'You already guessed that letter.',
      type: MessageType.ERROR,
      displayTime: this.displayTimes[MessageType.ERROR],
    };
  }
}
