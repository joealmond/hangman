import { Inject, Injectable } from '@nestjs/common';
import { GameRepository } from '../repositories/game-repository.interface';
import { WordProvider } from './word-provider.interface';
import { Game } from '../models/game.model';
import { GuessDto } from '../dtos/guess.dto';
import { TokenService } from '../../common/services/token.service';
import { MessageService } from './message.service';
import { appConfig } from 'src/config/app.config';
import { GameStatus } from '../models/game-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  constructor(
    @Inject('GameRepository')
    private readonly gameRepository: GameRepository,
    @Inject('WordProvider')
    private readonly wordService: WordProvider,
    private readonly tokenService: TokenService,
    private readonly messageService: MessageService,
  ) {}

  async createGame() {
    const gameId = uuidv4();
    const word = await this.getRandomWord();
    const maskedWord = this.createMaskedWord(word);
    const token = await this.tokenService.generateGameToken(gameId);

    console.log(`Word to guess: ${word}`);

    const game: Game = {
      id: gameId,
      word,
      maskedWord,
      guessedLetters: [],
      attempts: 0,
      maxAttempts: appConfig.maxAttempts,
      status: GameStatus.IN_PROGRESS,
    };

    await this.gameRepository.create(game);
    return {
      game,
      token,
      message: this.messageService.getPlaceholderMessage(),
    };
  }

  async getGameById(id: string) {
    const game = await this.gameRepository.findById(id);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  async getAllGames() {
    return await this.gameRepository.findAll();
  }

  async processGuess(id: string, guessedLetter: GuessDto) {
    const letter = guessedLetter.letter.toUpperCase();
    const game = await this.gameRepository.findById(id);

    if (!game) {
      throw new Error('Game not found');
    }
    if (game.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Game is not in progress');
    }
    if (game.guessedLetters.includes(letter)) {
      const message = this.messageService.getAlreadyGuessedMessage();
      return { game, message };
    }
    if (!appConfig.alphabet.includes(letter)) {
      const message = this.messageService.getInvalidGuessMessage();
      return { game, message };
    }
    game.guessedLetters.push(letter);

    if (game.word.includes(letter)) {
      game.maskedWord = this.updateMaskedWord(
        game.word,
        game.maskedWord,
        letter,
      );
    } else {
      game.attempts++;
    }

    this.checkGameStatus(game);
    const updatedGame = await this.gameRepository.update(game);
    return {
      game: updatedGame,
      message: this.getMessageForGameState(updatedGame, letter),
    };
  }

  async getRandomWord() {
    return await this.wordService.getRandomWord(appConfig.wordLength);
  }

  private createMaskedWord(word: string) {
    return '_'.repeat(word.length);
  }

  private updateMaskedWord(word: string, maskedWord: string, letter: string) {
    return maskedWord
      .split('')
      .map((char, index) => {
        return word[index] === letter ? letter : char;
      })
      .join('');
  }

  private checkGameStatus(game: Game) {
    if (game.maskedWord === game.word) {
      game.status = GameStatus.WON;
    } else if (game.attempts >= game.maxAttempts) {
      game.status = GameStatus.LOST;
    }
  }

  private getMessageForGameState(game: Game, letter: string) {
    if (game.status === GameStatus.WON) {
      return this.messageService.getVictoryMessage();
    }

    if (game.status === GameStatus.LOST) {
      return this.messageService.getGameOverMessage(game.word);
    }

    return this.messageService.getGuessInfoMessage(letter);
  }
}
