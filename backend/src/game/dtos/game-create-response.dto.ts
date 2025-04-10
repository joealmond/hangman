import { GameStatus } from '../models/game-status.enum';
import { GameMessage } from '../models/game-message.interface';

export class GameCreateResponseDto {
  id: string;
  maskedWord: string;
  guessedLetters: string[];
  attempts: number;
  maxAttempts: number;
  status: GameStatus;
  token: string;
  message: GameMessage;
}
