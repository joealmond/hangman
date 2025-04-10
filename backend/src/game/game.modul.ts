import { Module } from '@nestjs/common';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { WordService } from './services/word.service';
import { InMemoryGameRepository } from './repositories/in-memory-game.repository';

@Module({
  controllers: [GameController],
  providers: [
    GameService,
    {
      provide: 'WordProvider',
      useClass: WordService,
    },
    {
      provide: 'GameRepository',
      useClass: InMemoryGameRepository,
    },
  ],
})
export class GameModule {}
