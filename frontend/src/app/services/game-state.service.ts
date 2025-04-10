import { Injectable, signal, inject } from '@angular/core';
import {
  GameState,
  GameCreateResponseDto,
  GameUpdateResponseDto,
} from '../models/game-state.model';
import { MessageService } from './standard-message.service';
import { map, Observable, tap, throwError } from 'rxjs';
import { GameHttpService } from './game-http.service';
import { GameFactory } from './game.factory';
import { LocalStorage } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private readonly httpService = inject(GameHttpService);
  private readonly gameFactory = inject(GameFactory);
  private readonly state = signal<GameState>(
    this.gameFactory.createInitialGameState()
  );
  private gameId: string | null = null;
  private token: string | null = null;
  private readonly messageService = inject(MessageService);
  private readonly localStorageService = inject(LocalStorage);
  private readonly TOKEN_KEY = 'hangman_game_token';

  constructor() {
    this.initializeGameState();
  }

  private initializeGameState(): void {
    const savedState = this.localStorageService.loadState();
    if (savedState) {
      this.state.set(savedState);
      this.gameId = savedState.id;
      this.token = localStorage.getItem(this.TOKEN_KEY);
    }
  }

  isSavedGameExists(): boolean {
    return !!this.localStorageService.loadState();
  }

  get gameState(): GameState {
    return this.state();
  }

  updateState(partialState: Partial<GameState>): void {
    this.state.update((state) => ({ ...state, ...partialState }));
    this.localStorageService.saveState(this.state());
  }

  createGame(): Observable<void> {
    if (this.isSavedGameExists() && this.gameId && this.token) {
      this.initializeGameState();
      return new Observable<void>((observer) => {
        observer.next(undefined);
        observer.complete();
      });
    }

    return this.httpService.createGame().pipe(
      tap((response) => {
        this.processGameResponse(response, { setToken: true });
      }),
      map(() => undefined)
    );
  }

  getGame(gameId: string, token: string): Observable<void> {
    return this.httpService.getGame(gameId, token).pipe(
      tap((response) => {
        this.processGameResponse(response);
      }),
      map(() => undefined)
    );
  }

  makeGuess(letter: string): Observable<void> {
    if (!this.gameId || !this.token) {
      return throwError(() => new Error('Game not initialized'));
    }

    return this.httpService.makeGuess(this.gameId, this.token, letter).pipe(
      tap((response) => {
        this.processGameResponse(response, { letterGuessed: letter });
      }),
      map(() => undefined)
    );
  }

  resetGame(): void {
    this.state.set(this.getInitialGameState());
    this.gameId = null;
    this.token = null;
    this.localStorageService.clearState();
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private getInitialGameState(): GameState {
    return this.gameFactory.createInitialGameState();
  }

  private processGameResponse<
    T extends GameCreateResponseDto | GameUpdateResponseDto
  >(
    response: T,
    options?: {
      previousState?: GameState;
      letterGuessed?: string;
      setToken?: boolean;
    }
  ): void {
    this.updateGameState(response, options);
    this.handleResponseMessage(response, options);
    this.localStorageService.saveState(this.state());

    if (this.token) {
      localStorage.setItem(this.TOKEN_KEY, this.token);
    }
  }

  private updateGameState<
    T extends GameCreateResponseDto | GameUpdateResponseDto
  >(
    response: T,
    options?: {
      setToken?: boolean;
      previousState?: GameState;
      letterGuessed?: string;
    }
  ): void {
    if (options?.setToken) {
      this.updateStateWithNewGame(response as GameCreateResponseDto);
    } else {
      this.updateExistingGameState(response);
    }
  }

  private updateStateWithNewGame(response: GameCreateResponseDto): void {
    this.gameId = response.id;
    this.token = response.token;
    this.state.set({
      id: response.id,
      maskedWord: response.maskedWord,
      guessedLetters: response.guessedLetters,
      attempts: response.attempts,
      maxAttempts: response.maxAttempts,
      status: response.status,
    });

    if (this.token) {
      localStorage.setItem(this.TOKEN_KEY, this.token);
    }
  }

  private updateExistingGameState<T extends GameUpdateResponseDto>(
    response: T
  ): void {
    this.state.update((state) => ({
      ...state,
      maskedWord: response.maskedWord,
      guessedLetters: response.guessedLetters,
      attempts: response.attempts,
      status: response.status,
    }));
  }

  private handleResponseMessage<
    T extends GameCreateResponseDto | GameUpdateResponseDto
  >(
    response: T,
    options?: {
      previousState?: GameState;
      letterGuessed?: string;
    }
  ): void {
    if (!response.message) {
      return;
    }

    if (options?.letterGuessed && options?.previousState) {
      this.messageService.handleGuessResponse(
        options.letterGuessed,
        options.previousState,
        this.gameState,
        response.message
      );
    } else {
      this.messageService.showMessage(response.message);
    }
  }
}
