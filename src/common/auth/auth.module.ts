import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { BookBuildingGuard } from './booking/bookBuilding.guard';
import { PrismaService } from 'src/prisma/prisma.service';

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
