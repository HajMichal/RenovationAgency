import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ContractorOwnershipCheckMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) throw new UnauthorizedException('Not right access');
    const user = this.jwt.decode(token.split(' ')[1]);
    const contractorId = req.body.contractorId;

    const contractor = await this.prisma.contractor.findFirst({
      where: {
        id: contractorId,
      },
    });
    if (user.id === contractor?.userId) return next();
    else throw new UnauthorizedException('Not right access');
  }
}
