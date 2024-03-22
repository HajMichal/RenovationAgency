import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { BookBuildingGuard } from './bookBuilding.guard';
import { PrismaService } from 'src/providers/prisma/prisma.service';

// I want to have Global access to my Auth.Guard service that's why
// @Global decorator is set here
@Global()
@Module({
  providers: [
    BookBuildingGuard,
    {
      provide: APP_GUARD,
      useClass: AuthService,
    },
    JwtService,
    PrismaService,
  ],
})
export class AuthModule {}
