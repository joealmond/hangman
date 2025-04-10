import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { WordService } from './services/word.service';
import { InMemoryGameRepository } from './repositories/in-memory-game.repository';
import { TokenService } from '../common/services/token.service';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [GameController],
  providers: [
    GameService,
    TokenService,
    MessageService,
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
