import { GameMessage } from './message.model';

export enum GameStatus {
  MENU = 'MENU',
  START = 'START',
  IN_PROGRESS = 'IN_PROGRESS',
  WON = 'WON',
  LOST = 'LOST',
}

export interface GameState {
  id: string;
  maskedWord: string;
  guessedLetters: string[];
  attempts: number;
  maxAttempts: number;
  status: GameStatus;
  message?: GameMessage;
}

export interface GameCreateResponseDto {
  id: string;
  token: string;
  maskedWord: string;
  guessedLetters: string[];
  attempts: number;
  maxAttempts: number;
  status: GameStatus;
  message: GameMessage;
}

export interface GameUpdateResponseDto {
  maskedWord: string;
  guessedLetters: string[];
  attempts: number;
  status: GameStatus;
  message: GameMessage;
}

export interface GuessDto {
  letter: string;
}
