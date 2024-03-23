import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class CheckBuildingMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) throw new UnauthorizedException('Not right access');
    const body = req.body;

    const building = await this.prisma.building.findFirst({
      where: {
        id: body.buildingId,
      },
      include: {
        booking: true,
      },
    });

    if (!building) throw new NotFoundException('Building not exist');

    return next();
  }
}
