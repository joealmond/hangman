import { GameStatus } from './game-status.enum';

export interface Game {
  id: string;
  word: string;
  maskedWord: string;
  guessedLetters: string[];
  attempts: number;
  maxAttempts: number;
  status: GameStatus;
}
