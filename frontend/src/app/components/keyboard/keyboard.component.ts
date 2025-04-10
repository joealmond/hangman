import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyboardEventService } from '../../services/keyboard-event.service';
import { Subscription } from 'rxjs';
import { GameStateService } from '../../services/game-state.service';
import { alphabet } from '../../constants/game-constants';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class KeyboardComponent implements OnInit, OnDestroy {
  alphabet = alphabet;
  private gameState = inject(GameStateService);
  private keyboardService = inject(KeyboardEventService);
  private keyPressSubscription: Subscription;

  @Output() keyPressed: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    this.keyPressSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.keyPressSubscription = this.keyboardService.keyPress$.subscribe(
      (key: string) => {
        this.keyPressed.emit(key);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.keyPressSubscription) {
      this.keyPressSubscription.unsubscribe();
    }
  }

  isLetterGuessed(letter: string): boolean {
    const state = this.gameState.gameState;
    return state.guessedLetters.includes(letter.toUpperCase());
  }

  makeGuess(letter: string): void {
    this.keyPressed.emit(letter.toUpperCase());
  }
}
