/// <reference types="node" />
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageType } from '../constants/game-constants';
import { GameState, GameStatus } from '../models/game-state.model';
import { GameMessage } from '../models/message.model';
import { GameMessageProvider } from '../models/message-provider.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService implements GameMessageProvider {
  private readonly messageSubject: BehaviorSubject<GameMessage> =
    new BehaviorSubject<GameMessage>({
      text: '',
      type: MessageType.PLACEHOLDER,
      displayTime: 0,
    });

  public readonly message$: Observable<GameMessage> =
    this.messageSubject.asObservable();

  private timeoutId: number | NodeJS.Timeout | null = null;

  public async setInitialMessage(
    state: GameState,
    updateStateFn?: (newState: GameState) => void
  ): Promise<void> {
    if (state.message) {
      this.showMessage(state.message);
    } else {
      this.clearMessage();
    }
  }

  public canAcceptInput(state: GameState): boolean {
    return state.status === GameStatus.IN_PROGRESS;
  }

  public showMessage(message: GameMessage): void {
    if (
      message.type === MessageType.PLACEHOLDER &&
      this.messageSubject.value.type !== MessageType.PLACEHOLDER
    ) {
      return;
    }

    this.clearTimeout();

    this.messageSubject.next(message);

    if (message.displayTime > 0) {
      this.timeoutId = setTimeout(() => {
        this.clearMessage(true);
      }, message.displayTime);
    }
  }

  public clearMessage(showPlaceholder: boolean = true): void {
    this.clearTimeout();

    if (showPlaceholder) {
      this.messageSubject.next({
        text: 'Waiting for input...',
        type: MessageType.PLACEHOLDER,
        displayTime: 0,
      });
    } else {
      this.messageSubject.next({
        text: '',
        type: MessageType.PLACEHOLDER,
        displayTime: 0,
      });
    }
  }

  private clearTimeout(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId as NodeJS.Timeout);
      this.timeoutId = null;
    }
  }

  public handleGuessResponse(
    letter: string,
    previousState: GameState,
    newState: GameState,
    message: GameMessage
  ): void {
    this.showMessage(message);
  }
}
