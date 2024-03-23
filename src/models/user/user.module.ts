import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserOwnershipCheckMiddleware } from 'src/common/middleware/user/userOwnershipCheck.middleware';
import { user } from 'src/common/constatns/modelsEndpoints';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, JwtService],
  exports: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserOwnershipCheckMiddleware)
      .exclude(
        {
          path: `${user}/(.*)`,
          method: RequestMethod.POST,
        },
        { path: `${user}/(.*)`, method: RequestMethod.GET },
      )
      .forRoutes(UserController);
  }
}
