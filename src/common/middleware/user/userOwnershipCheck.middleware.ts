import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class UserOwnershipCheckMiddleware implements NestMiddleware {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) throw new UnauthorizedException('Not right access');
    const userPayload = this.jwt.decode(token.split(' ')[1]);

    const user = await this.prisma.user.findFirst({
      where: {
        id: userPayload.id,
      },
    });
    if (user) return next();
    else throw new UnauthorizedException('Not right access');
  }
}
