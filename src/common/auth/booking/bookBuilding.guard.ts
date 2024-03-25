import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BookBuildingGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    const userPayload = this.jwt.decode(token.split(' ')[1]);
    const body = request.body;

    const isContractor = await this.prisma.contractor.findFirst({
      where: {
        userId: userPayload.id,
      },
    });
    if (!isContractor)
      throw new ConflictException('Need to create contractor account first');

    const building = await this.prisma.building.findFirst({
      where: {
        id: body.buildingId,
      },
      include: {
        booking: true,
      },
    });
    if (!building) throw new NotFoundException('Building not exist');

    if (building?.booking?.contractorId)
      throw new ConflictException('Building is already booked');

    return true;
  }
}
