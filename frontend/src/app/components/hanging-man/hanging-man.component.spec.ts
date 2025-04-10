import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from '../game.component';
import { GameState } from '../../models/game-state.model';
import { initialGameState } from '../../constants/game-constants';
import { BehaviorSubject } from 'rxjs';
import { HangingManComponent } from './hanging-man.component';

describe('HangingManComponent', () => {
  let component: HangingManComponent;
  let fixture: ComponentFixture<HangingManComponent>;
  let gameComponent: any;
  let gameStateSubject: BehaviorSubject<GameState>;

  beforeEach(() => {
    gameStateSubject = new BehaviorSubject<GameState>({ ...initialGameState });

    const gameComponentMock = {
      gameState: {
        getGameState: () => gameStateSubject.value,
        gameState$: gameStateSubject.asObservable(),
      },
    };

    TestBed.configureTestingModule({
      imports: [HangingManComponent],
      providers: [{ provide: GameComponent, useValue: gameComponentMock }],
    });

    fixture = TestBed.createComponent(HangingManComponent);
    component = fixture.componentInstance;
    gameComponent = TestBed.inject(GameComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive gameState object and remainingGuesses property', () => {
    expect(component.gameState).toBeDefined();
    expect(component.gameState.getGameState().remainingGuesses).toBeDefined();
  });

  it('should have initial remainingGuesses equal to initialGameState', () => {
    expect(component.gameState.getGameState().remainingGuesses).toEqual(
      initialGameState.remainingGuesses
    );
  });

  it('remainingGuesses should be a positive whole number or 0', () => {
    const remainingGuesses =
      component.gameState.getGameState().remainingGuesses;
    expect(Number.isInteger(remainingGuesses)).toBe(true);
    expect(remainingGuesses).toBeGreaterThanOrEqual(0);
  });

  it('remainingGuesses should be less or equal to gameState.maxAttempts and more or equal to 0', () => {
    const gameState: GameState = component.gameState.getGameState();
    const remainingGuesses = gameState.remainingGuesses;
    expect(remainingGuesses).toBeGreaterThanOrEqual(0);
    expect(remainingGuesses).toBeLessThanOrEqual(gameState.maxAttempts);
  });

  it('should update remainingGuesses when gameState changes', () => {
    const newRemainingGuesses = 3;
    gameStateSubject.next({
      ...initialGameState,
      remainingGuesses: newRemainingGuesses,
    });
    fixture.detectChanges();
    expect(component.gameState.getGameState().remainingGuesses).toEqual(
      newRemainingGuesses
    );
  });

  it('should handle remainingGuesses equal to 0', () => {
    gameStateSubject.next({ ...initialGameState, remainingGuesses: 0 });
    fixture.detectChanges();
    expect(component.gameState.getGameState().remainingGuesses).toEqual(0);
  });

  it('should handle remainingGuesses equal to maxAttempts', () => {
    gameStateSubject.next({
      ...initialGameState,
      remainingGuesses: initialGameState.maxAttempts,
    });
    fixture.detectChanges();
    expect(component.gameState.getGameState().remainingGuesses).toEqual(
      initialGameState.maxAttempts
    );
  });
});
