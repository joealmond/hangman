import { Injectable } from '@angular/core';
import { GameState, GameStatus } from '../models/game-state.model';

@Injectable({
  providedIn: 'root',
})
export class GameFactory {
  createInitialGameState(): GameState {
    return {
      id: '',
      maskedWord: '',
      guessedLetters: [],
      attempts: 0,
      maxAttempts: 6,
      status: GameStatus.MENU,
    };
  }
}
