import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyboardComponent } from './keyboard.component';
import { KeyboardEventService } from '../../services/keyboard-event.service';
import { GameStateService } from '../../services/game-state.service';
import { of, Subject } from 'rxjs';
import { alphabet } from '../../constants/game-constants';

describe('KeyboardComponent', () => {
  let component: KeyboardComponent;
  let fixture: ComponentFixture<KeyboardComponent>;
  let keyboardService: KeyboardEventService;
  let gameStateService: GameStateService;

  beforeEach(() => {
    const keyboardServiceStub = {
      keyPress$: new Subject<string>(),
    };

    const gameStateServiceStub = {
      getGameState: () => ({
        secretWord: 'test',
        guessedLetters: [],
        remainingGuesses: 6,
      }),
    };

    TestBed.configureTestingModule({
      imports: [KeyboardComponent],
      providers: [
        { provide: KeyboardEventService, useValue: keyboardServiceStub },
        { provide: GameStateService, useValue: gameStateServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyboardComponent);
    component = fixture.componentInstance;
    keyboardService = TestBed.inject(KeyboardEventService);
    gameStateService = TestBed.inject(GameStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive alphabet as string[]', () => {
    expect(component.alphabet).toEqual(alphabet);
  });

  it('should receive gameState', () => {
    expect(gameStateService).toBeTruthy();
  });

  it('should receive keyboard service', () => {
    expect(keyboardService).toBeTruthy();
  });

  it('should emit keypress', () => {
    spyOn(component.keyPressed, 'emit');
    const letter = 'A';
    component.makeGuess(letter);
    expect(component.keyPressed.emit).toHaveBeenCalledWith(letter);
  });

  it('should subscribe to key press on init', () => {
    const spy = spyOn(keyboardService.keyPress$, 'subscribe');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('on destroy unsubscribe', () => {
    component.ngOnInit();
    expect(component['keyPressSubscription'].closed).toBe(false);
    component.ngOnDestroy();
    expect(component['keyPressSubscription'].closed).toBe(true);
  });

  describe('isLetterGuessed', () => {
    it('should return true if letter is guessed (lowercase)', () => {
      spyOn(gameStateService, 'getGameState').and.returnValue({
        wordToGuess: 'test',
        maskedWord: 't___',
        guessedLetters: ['a'],
        remainingGuesses: 5,
        stateLabel: 'game',
        wordLength: 4,
        maxAttempts: 6,
      });
      expect(component.isLetterGuessed('a')).toBe(true);
    });

    it('should return true if letter is guessed (uppercase)', () => {
      spyOn(gameStateService, 'getGameState').and.returnValue({
        wordToGuess: 'test',
        maskedWord: 't___',
        guessedLetters: ['a'],
        remainingGuesses: 5,
        stateLabel: 'game',
        wordLength: 4,
        maxAttempts: 6,
      });
      expect(component.isLetterGuessed('A')).toBe(true);
    });

    it('should return false if letter is not guessed (lowercase)', () => {
      spyOn(gameStateService, 'getGameState').and.returnValue({
        wordToGuess: 'test',
        maskedWord: '____',
        guessedLetters: ['a'],
        remainingGuesses: 6,
        stateLabel: 'game',
        wordLength: 4,
        maxAttempts: 6,
      });
      expect(component.isLetterGuessed('1')).toBe(false);
    });

    it('should return false if letter is not guessed (uppercase)', () => {
      spyOn(gameStateService, 'getGameState').and.returnValue({
        wordToGuess: 'test',
        maskedWord: '____',
        guessedLetters: ['a'],
        remainingGuesses: 6,
        stateLabel: 'game',
        wordLength: 4,
        maxAttempts: 6,
      });
      expect(component.isLetterGuessed('1')).toBe(false);
    });
  });

  it('should call keyPressed.emit with uppercase letter when makeGuess is called', () => {
    spyOn(component.keyPressed, 'emit');
    component.makeGuess('a');
    expect(component.keyPressed.emit).toHaveBeenCalledWith('A');
  });
});
