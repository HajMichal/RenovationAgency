import { Module } from '@nestjs/common';
import { BuildsController } from './builds.controller';
import { BuildsService } from './builds.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BuildsController],
  providers: [BuildsService, PrismaService],
})
export class BuildsModule {}
