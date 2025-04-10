import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from '../game.component';

@Component({
  selector: 'app-hanging-man',
  templateUrl: './hanging-man.component.html',
  styleUrls: ['./hanging-man.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HangingManComponent {
  private gameComponent = inject(GameComponent);

  get gameState() {
    return this.gameComponent.gameStateService.gameState;
  }
  getRemainingGuesses(): number {
    return this.gameState.maxAttempts - this.gameState.attempts;
  }
}
