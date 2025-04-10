import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GameModule } from './game/game.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        '..',
        'frontend',
        'dist',
        '2hangman',
        'browser',
      ),
      exclude: ['/api/*splat'],
      serveStaticOptions: {
        fallthrough: true,
        index: false,
        extensions: ['html', 'js', 'css', 'ico', 'png', 'jpg'],
      },
    }),
    GameModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
