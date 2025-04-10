import { Injectable } from '@nestjs/common';
import { GameRepository } from './game-repository.interface';
import { Game } from '../models/game.model';

@Injectable()
export class InMemoryGameRepository implements GameRepository {
  private games: Map<string, Game> = new Map();

  async create(game: Game): Promise<Game> {
    this.games.set(game.id, game);
    return Promise.resolve(game);
  }

  async findById(id: string): Promise<Game | null> {
    const game = this.games.get(id);
    if (!game) {
      return null;
    }
    return Promise.resolve(game);
  }

  async update(game: Game): Promise<Game> {
    const existingGame = this.games.get(game.id);
    if (!existingGame) {
      throw new Error('Game not found');
    }

    this.games.set(game.id, game);
    return Promise.resolve(game);
  }

  async delete(id: string): Promise<void> {
    this.games.delete(id);
    return Promise.resolve();
  }

  async findAll(): Promise<Game[]> {
    return Promise.resolve(Array.from(this.games.values()));
  }
}
