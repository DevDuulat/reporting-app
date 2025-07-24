import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { IncomingHttpHeaders } from 'http';
import { AuthJwtService } from '../auth-jwt.service';
import { UsersService } from '../../users/users.service';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_KEY } from '@app/common/decorators/skip-auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: AuthJwtService,
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request.headers);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAccessToken(token);
      if (typeof payload === 'object' && payload !== null) {
        const isNotExpired =
          payload['exp'] && payload['exp'] * 1000 > Date.now();
        const nodId: number = payload['nod_id'];
        const user = await this.userService.findOne(nodId);
        if (!(isNotExpired && nodId && user)) return false;
        request.user = user;
      } else return false;
    } catch (e) {
      throw e;
    }
    return true;
  }

  private extractTokenFromHeader(headers: IncomingHttpHeaders): string {
    if (!headers || !headers.authorization) return '';
    let token: string = headers.authorization;

    if (token.startsWith('Bearer '))
      token = headers.authorization.split(' ')[1].trim();

    return token;
  }
}
