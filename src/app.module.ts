import { Module } from '@nestjs/common';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './common/auth/auth.module';
import { BuildsModule } from './models/building/builds.module';

@Module({
  imports: [AuthModule, UserModule, BuildsModule],
})
export class AppModule {}
