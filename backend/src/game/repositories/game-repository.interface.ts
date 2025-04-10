import { Game } from '../models/game.model';

export interface GameRepository {
  create(game: Game): Promise<Game>;
  findById(id: string): Promise<Game | null>;
  update(game: Game): Promise<Game>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Game[]>;
}
