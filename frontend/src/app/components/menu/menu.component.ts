import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { GameStatus } from '../../models/game-state.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MenuComponent implements OnInit {
  gameStateService = inject(GameStateService);
  private router = inject(Router);
  GameStatus = GameStatus;

  ngOnInit(): void {
    if (this.gameStateService.gameState.status !== GameStatus.MENU) {
      console.log('Existing game found in state');
    }
  }

  startOrContinueGame(): void {
    if (this.gameStateService.gameState.status === GameStatus.MENU) {
      this.gameStateService.resetGame();
      this.gameStateService.createGame().subscribe({
        next: () => {
          this.router.navigate(['/game']);
        },
        error: (error) => {
          console.error('Failed to create game:', error);
        },
      });
    } else {
      this.router.navigate(['/game']);
    }
  }
}
