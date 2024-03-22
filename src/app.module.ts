import { Module } from '@nestjs/common';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './common/auth/auth.module';
import { BuildsModule } from './models/building/building.module';
import { ContractorModule } from './models/contractor/contractor.module';
import { BookingModule } from './models/booking/booking.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BuildsModule,
    ContractorModule,
    BookingModule,
  ],
})
export class AppModule {}
