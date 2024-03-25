import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BuildingsController } from './building.controller';
import { BuildingsService } from './building.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { BuildingOwnershipCheckMiddleware } from '../../common/middleware/building/ownershipCheck.middleware';
import { building } from '../../common/constatns/modelsEndpoints';

@Module({
  imports: [UserModule],
  controllers: [BuildingsController],
  providers: [BuildingsService, PrismaService, JwtService],
})
export class BuildsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BuildingOwnershipCheckMiddleware)
      .exclude(
        {
          path: `${building}/(.*)`,
          method: RequestMethod.POST,
        },
        { path: `${building}/(.*)`, method: RequestMethod.GET },
      )
      .forRoutes(BuildingsController);
  }
}
