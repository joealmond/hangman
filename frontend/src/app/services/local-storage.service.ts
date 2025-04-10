import { Injectable } from '@angular/core';
import { StorageProvider } from '../models/storage-provider.model';
import { GameState } from '../models/game-state.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage implements StorageProvider {
  private readonly STORAGE_KEY = 'hangman_game_state';

  saveState(state: GameState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  loadState(): GameState | null {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }

  clearState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
