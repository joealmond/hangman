import {
  Component,
  effect,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { GameStateService } from '../services/game-state.service';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { HangingManComponent } from './hanging-man/hanging-man.component';
import { MaskedWordComponent } from './masked-word/masked-word.component';
import { RouterModule } from '@angular/router';
import { MessageComponent } from './message/message.component';
import { GameStatus } from '../models/game-state.model';
import { ScaleService } from '../services/scale.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [
    KeyboardComponent,
    HangingManComponent,
    MaskedWordComponent,
    RouterModule,
    MessageComponent,
  ],
  standalone: true,
})
export class GameComponent implements OnInit {
  public gameStateService = inject(GameStateService);
  private scaleService = inject(ScaleService);
  @ViewChild('newGameButton') newGameButton: ElementRef | undefined;

  constructor() {
    effect(() => {
      console.log('gameState changed:', this.gameStateService.gameState);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.scaleService.setScaleFactor();
  }

  ngOnInit(): void {
    this.scaleService.setScaleFactor();

    if (
      this.gameStateService.gameState.status === GameStatus.MENU &&
      !this.gameStateService.isSavedGameExists()
    ) {
      this.gameStateService.createGame().subscribe({
        error: (err) => console.error('Error loading saved game:', err),
      });
    }
  }

  handleGuess(letter: string): void {
    if (this.gameStateService.gameState.status !== GameStatus.IN_PROGRESS) {
      return;
    }

    this.gameStateService.makeGuess(letter).subscribe({
      error: (err) => console.error('Error making guess:', err),
    });
  }

  getGameStateMaskedWord(): string {
    return this.gameStateService.gameState.maskedWord;
  }

  initGame(): void {
    this.gameStateService.resetGame();
    this.gameStateService.createGame().subscribe({
      error: (err) => console.error('Error creating game:', err),
    });

    if (this.newGameButton) {
      this.newGameButton.nativeElement.blur();
    }
  }
}
