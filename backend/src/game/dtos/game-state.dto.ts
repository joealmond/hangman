import { GameStatus } from '../models/game-status.enum';

export class GameStateDto {
  id: string;
  maskedWord: string;
  guessedLetters: string[];
  attempts: number;
  maxAttempts: number;
  status: GameStatus;
  token?: string;
}
