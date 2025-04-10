import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { GameRequest, GamePayload } from '../types/game-request.type';
import { Request } from 'express';

@Injectable()
export class GameTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: GameRequest = context
      .switchToHttp()
      .getRequest<GameRequest>();

    const token = this.extractTokenFromHeader(request as GameRequest & Request);
    if (!token) {
      throw new UnauthorizedException('Game token is missing');
    }

    const payload: GamePayload | null =
      await this.tokenService.validateGameToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid game token');
    }

    const requestedGameId = request.params.gameId || request.params.id;
    if (payload.gameId !== requestedGameId) {
      throw new UnauthorizedException(
        'Token does not match the requested game',
      );
    }

    request.gamePayload = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
