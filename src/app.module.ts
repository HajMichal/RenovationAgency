import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './common/auth/auth.module';
import { BuildsModule } from './modules/building/building.module';
import { ContractorModule } from './modules/contractor/contractor.module';
import { BookingModule } from './modules/booking/booking.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BuildsModule,
    ContractorModule,
    BookingModule,
    PrismaModule,
  ],
})
export class AppModule {}
