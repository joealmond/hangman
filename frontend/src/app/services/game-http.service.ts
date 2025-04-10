import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { API_BASE_URL } from '../app.config';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  GameCreateResponseDto,
  GameUpdateResponseDto,
} from '../models/game-state.model';
import { GameMessage } from '../models/message.model';
import { MessageType } from '../constants/game-constants';
import { MessageService } from './standard-message.service';

@Injectable({
  providedIn: 'root',
})
export class GameHttpService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);
  private readonly messageService = inject(MessageService);

  createGame(): Observable<GameCreateResponseDto> {
    return this.http.post<GameCreateResponseDto>(`${this.apiUrl}/games`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating game:', error);
        this.messageService.showMessage({
          text: `Failed to create a new game. ${error.message}`,
          type: MessageType.ERROR,
          displayTime: 2000,
        });
        return throwError(() => error);
      })
    );
  }

  getGame(gameId: string, token: string): Observable<GameUpdateResponseDto> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .get<GameUpdateResponseDto>(`${this.apiUrl}/games/${gameId}`, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error getting game:', error);
          this.messageService.showMessage({
            text: `Failed to get the game. ${error.message}`,
            type: MessageType.ERROR,
            displayTime: 2000,
          });
          return throwError(() => error);
        })
      );
  }

  makeGuess(
    gameId: string,
    token: string,
    letter: string
  ): Observable<GameUpdateResponseDto> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post<GameUpdateResponseDto>(
        `${this.apiUrl}/games/${gameId}/guesses`,
        { letter },
        { headers }
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error making a guess:', error);
          this.messageService.showMessage({
            text: `Failed to make a guess. ${error.message}`,
            type: MessageType.ERROR,
            displayTime: 2000,
          });
          return throwError(() => error);
        })
      );
  }
}
