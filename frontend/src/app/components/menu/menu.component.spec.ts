import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { GameStateService } from '../../services/game-state.service';
import { of } from 'rxjs';
import { GameState } from '../../models/game-state.model';
import { ActivatedRoute } from '@angular/router';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let gameStateService: GameStateService;

  const setupTestBed = (
    gameStateMock: any = {
      getGameState: () => of({ stateLabel: 'start' } as GameState),
    },
    activatedRouteMock: any = {
      snapshot: { paramMap: { get: (key: string) => null } },
    }
  ) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        { provide: GameStateService, useValue: gameStateMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    gameStateService = TestBed.inject(GameStateService);
    fixture.detectChanges();
  };

  beforeEach(() => {
    setupTestBed();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Back to Game" when gameState is not "start"', () => {
    const gameStateServiceMock = {
      getGameState: () => of({ stateLabel: 'game' } as GameState),
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => null,
        },
      },
    };

    setupTestBed(gameStateServiceMock, activatedRouteMock);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('.start-game-button')?.textContent?.trim()
    ).toBe('Back to Game');
  });

//   it('should display "Start Game" when gameState is "start"', async () => {
//     const gameStateServiceMock = {
//       getGameState: () => of({ stateLabel: 'start' } as GameState),
//     };

//     const activatedRouteMock = {
//       snapshot: {
//         paramMap: {
//           get: (key: string) => 'menu',
//         },
//       },
//     };

//     setupTestBed(gameStateServiceMock, activatedRouteMock);
//     await fixture.detectChanges();
//     const compiled = fixture.nativeElement as HTMLElement;
//     const startGameButton = compiled.querySelector('.start-game-button');
//     expect(startGameButton?.textContent?.trim()).toBe('Start Game');
//     expect(startGameButton?.getAttribute('routerLink')).toBe('/game');
//   });
});
