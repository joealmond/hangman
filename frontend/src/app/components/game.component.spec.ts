import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { GameStateService } from '../services/game-state.service';
import { GuessHandlerService } from '../services/guess-handler.service';
import { GameInitializerService } from '../services/game-initializer.service';
import { ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { generateInitialMaskedWord } from '../constants/game-constants';
import { GameState } from '../models/game-state.model';
import { StorageProvider } from '../models/storage-provider.model';
import { LocalStorage } from '../services/local-storage.service';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameStateService: GameStateService;
  let guessHandlerService: GuessHandlerService;
  let gameInitializerService: GameInitializerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent, RouterModule],
      providers: [
        GameStateService,
        GuessHandlerService,
        GameInitializerService,
        { provide: 'StorageProvider', useClass: LocalStorage },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  return 'test';
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    gameStateService = TestBed.inject(GameStateService);
    guessHandlerService = TestBed.inject(GuessHandlerService);
    gameInitializerService = TestBed.inject(GameInitializerService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('onResize should setScaleFactor', () => {
    spyOn(component, 'setScaleFactor');
    component.onResize();
    expect(component.setScaleFactor).toHaveBeenCalled();
  });

  it('initGame should call initializeGame and blur the new game button', async () => {
    spyOn(gameInitializerService, 'initializeGame').and.returnValue(
      Promise.resolve()
    );
    component.newGameButton = {
      nativeElement: { blur: jasmine.createSpy('blur') },
    } as ElementRef;

    await component.initGame();

    expect(gameInitializerService.initializeGame).toHaveBeenCalled();
    expect(component.newGameButton.nativeElement.blur).toHaveBeenCalled();
  });

  it('getGameStateMaskedWord should return the masked word from the game state', () => {
    const mockMaskedWord = '_____';
    spyOn(gameStateService, 'getGameState').and.returnValue({
      maskedWord: mockMaskedWord,
    } as GameState);

    const maskedWord = component.getGameStateMaskedWord();

    expect(maskedWord).toBe(mockMaskedWord);
    expect(gameStateService.getGameState).toHaveBeenCalled();
  });

  it('setScaleFactor should set the --vh-scale-factor property', () => {
    const setPropertySpy = spyOn(document.documentElement.style, 'setProperty');
    component.setScaleFactor();
    expect(setPropertySpy).toHaveBeenCalledWith(
      '--vh-scale-factor',
      jasmine.any(String)
    );
  });

  it('ngOnInit should call setScaleFactor and update state if maskedWord and wordToGuess are empty', () => {
    spyOn(component, 'setScaleFactor');
    spyOn(gameStateService, 'getGameState').and.returnValue({
      maskedWord: '',
      wordToGuess: '',
      wordLength: 5,
    } as GameState);
    spyOn(gameStateService, 'updateState');

    component.ngOnInit();

    expect(component.setScaleFactor).toHaveBeenCalled();
    expect(gameStateService.updateState).toHaveBeenCalledWith({
      maskedWord: generateInitialMaskedWord(5),
    });
  });

  it('handleGuess should call guessHandler.handleGuess', () => {
    spyOn(guessHandlerService, 'handleGuess');
    const letter = 'A';
    component.handleGuess(letter);
    expect(guessHandlerService.handleGuess).toHaveBeenCalledWith(letter);
  });

  it('onLetterClick should call guessHandler.handleGuess', () => {
    spyOn(guessHandlerService, 'handleGuess');
    const letter = 'B';
    component.onLetterClick(letter);
    expect(guessHandlerService.handleGuess).toHaveBeenCalledWith(letter);
  });
});
