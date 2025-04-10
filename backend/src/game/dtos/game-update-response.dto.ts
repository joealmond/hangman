import { GameStatus } from '../models/game-status.enum';
import { GameMessage } from '../models/game-message.interface';

export class GameUpdateResponseDto {
  maskedWord: string;
  guessedLetters: string[];
  attempts: number;
  status: GameStatus;
  message: GameMessage;
}
