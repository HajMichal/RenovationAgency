import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

// I want to have Global access to my Auth.Guard service that's why
// @Global decorator is set here
@Global()
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthService,
    },
    JwtService,
  ],
})
export class AuthModule {}
