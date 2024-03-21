import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ContractorController } from './contractor.controller';
import { ContractorService } from './contractor.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UserModule } from '../user/user.module';
import { ContractorOwnershipCheckMiddleware } from 'src/common/middleware/contractor/ownershipCheck.middleware';
import { contractor } from 'src/common/constatns/modelsEndpoints';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule],
  controllers: [ContractorController],
  providers: [ContractorService, PrismaService, JwtService],
})
export class ContractorModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContractorOwnershipCheckMiddleware)
      .exclude(
        {
          path: contractor,
          method: RequestMethod.POST,
        },
        { path: contractor, method: RequestMethod.GET },
        // `${contractor}/(.*)`,
      )
      .forRoutes(ContractorController);
  }
}
