import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { GuessDto } from '../dtos/guess.dto';
import { GameTokenGuard } from '../../common/guards/game-token.guard';
import { GameStateDto } from '../dtos/game-state.dto';
import { GameCreateResponseDto } from '../dtos/game-create-response.dto';
import { GameUpdateResponseDto } from '../dtos/game-update-response.dto';
import { Game } from '../models/game.model';
import { MessageService } from '../services/message.service';
import { GameStatus } from '../models/game-status.enum';
import { MessageType } from '../models/message-type.enum';

@Controller('api/games')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly messageService: MessageService,
  ) {}

  @Get()
  async getAllGames(): Promise<{ games: GameStateDto[] }> {
    const games = await this.gameService.getAllGames();
    return {
      games: games.map((game) => this.mapToGameStateDto(game)),
    };
  }

  @Post('/')
  async createGame(): Promise<GameCreateResponseDto> {
    const { game, token, message } = await this.gameService.createGame();
    return {
      id: game.id,
      maskedWord: game.maskedWord,
      guessedLetters: game.guessedLetters,
      attempts: game.attempts,
      maxAttempts: game.maxAttempts,
      status: game.status,
      token,
      message,
    };
  }

  @Get(':id')
  @UseGuards(GameTokenGuard)
  async getGameState(@Param('id') id: string): Promise<GameUpdateResponseDto> {
    const game = await this.gameService.getGameById(id);
    if (!game) {
      throw new Error('Game not found');
    }
    return {
      ...this.mapToGameUpdateResponseDto(game),
      message: this.getMessageForGameStatus(game),
    };
  }

  @Post(':id/guesses')
  @UseGuards(GameTokenGuard)
  async makeGuess(
    @Param('id') id: string,
    @Body() letterDto: GuessDto,
  ): Promise<GameUpdateResponseDto> {
    const game = await this.gameService.getGameById(id);
    if (!game) {
      throw new Error('Game not found');
    }

    const { game: updatedGame, message } = await this.gameService.processGuess(
      game.id,
      letterDto,
    );

    if (message.type === MessageType.ERROR) {
      return {
        ...this.mapToGameUpdateResponseDto(game),
        message,
      };
    }

    return {
      ...this.mapToGameUpdateResponseDto(updatedGame),
      message,
    };
  }

  private mapToGameStateDto(game: Game): GameStateDto {
    return {
      id: game.id,
      maskedWord: game.maskedWord,
      guessedLetters: game.guessedLetters,
      attempts: game.attempts,
      maxAttempts: game.maxAttempts,
      status: game.status,
    };
  }

  private mapToGameUpdateResponseDto(
    game: Game,
  ): Omit<GameUpdateResponseDto, 'message'> {
    return {
      maskedWord: game.maskedWord,
      guessedLetters: game.guessedLetters,
      attempts: game.attempts,
      status: game.status,
    };
  }

  private getMessageForGameStatus(game: Game) {
    if (game.status === GameStatus.WON) {
      return this.messageService.getVictoryMessage();
    }

    if (game.status === GameStatus.LOST) {
      return this.messageService.getGameOverMessage(game.word);
    }

    return this.messageService.getPlaceholderMessage();
  }
}
