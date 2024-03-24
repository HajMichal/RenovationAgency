import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BuildingOwnershipCheckMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) throw new UnauthorizedException('Not right access');
    const user = this.jwt.decode(token.split(' ')[1]);
    const buildingId = req.body.buildingId;
    const building = await this.prisma.building.findFirst({
      where: {
        id: buildingId,
      },
    });

    if (!building) throw new NotFoundException('Building not found');
    else if (user.id === building?.userId) return next();
    else throw new UnauthorizedException('Not right access');
  }
}
