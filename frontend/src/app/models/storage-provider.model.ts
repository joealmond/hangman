import { GameState } from './game-state.model';

export interface StorageProvider {
    saveState(state: GameState): void;
    loadState(): GameState | null;
  }