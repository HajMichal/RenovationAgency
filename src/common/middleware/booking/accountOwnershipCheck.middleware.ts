import {
  ConflictException,
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class AccountOwnershipCheckMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) throw new UnauthorizedException('Not right access');
    const userPayload = this.jwt.decode(token.split(' ')[1]);
    const body = req.body;

    const isContractor = await this.prisma.contractor.findFirst({
      where: {
        userId: userPayload.id,
      },
    });
    if (!isContractor)
      throw new ConflictException('Need create contractor account first');
    const building = await this.prisma.building.findFirst({
      where: {
        id: body.buildingId,
      },
      include: {
        booking: true,
      },
    });

    if (!building) throw new NotFoundException('Building not exist');

    if (building?.booking)
      throw new ConflictException('Building is already booked');

    return next();
    // else throw new UnauthorizedException('Not right access');
  }
}
