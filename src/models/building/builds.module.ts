import { Module } from '@nestjs/common';
import { BuildsController } from './builds.controller';
import { BuildsService } from './builds.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/models/user/user.service';

@Module({
  controllers: [BuildsController],
  providers: [BuildsService, PrismaService, JwtService, UserService],
})
export class BuildsModule {}
