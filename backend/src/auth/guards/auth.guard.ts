import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { IncomingHttpHeaders } from 'http';
import { AuthJwtService } from '../auth-jwt.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: AuthJwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
