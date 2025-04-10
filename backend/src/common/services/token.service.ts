import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from 'src/config/app.config';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateGameToken(gameId: string): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        { gameId },
        { secret: appConfig.jwtSecret },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate game token: ${message}`);
    }
  }

  async validateGameToken(token: string): Promise<{ gameId: string } | null> {
    try {
      const payload = await this.jwtService.verifyAsync<{ gameId: string }>(
        token,
        {
          secret: appConfig.jwtSecret,
        },
      );

      if (
        typeof payload === 'object' &&
        payload !== null &&
        'gameId' in payload &&
        typeof payload.gameId === 'string'
      ) {
        return { gameId: payload.gameId };
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
}
