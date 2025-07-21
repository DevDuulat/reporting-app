import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthJwtService } from './auth-jwt.service';
import { JwtModule } from '@nestjs/jwt';
@Global()
@Module({
  imports: [JwtModule, HttpModule],
  providers: [AuthJwtService, AuthGuard],
  exports: [AuthJwtService, AuthGuard],
})
export class AuthModule {}
