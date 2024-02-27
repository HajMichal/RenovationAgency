import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BuildsModule } from './building/builds.module';

@Module({
  imports: [AuthModule, UserModule, BuildsModule],
})
export class AppModule {}
