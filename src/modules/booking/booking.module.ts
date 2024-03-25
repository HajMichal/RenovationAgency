import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CheckBuildingMiddleware } from '../../common/middleware/booking/checkBuilding.middleware';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, JwtService],
})
export class BookingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckBuildingMiddleware).forRoutes(BookingController);
  }
}
