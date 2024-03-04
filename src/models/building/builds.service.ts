import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateBuildingDto, FiltersDto, UpdateBuildingDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/models/user/user.service';

@Injectable()
export class BuildsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async createBuilding(data: CreateBuildingDto, auth: string) {
    const token = auth.split(' ') ?? [];
    const { id } = this.jwtService.decode(token[1]);
    const user = await this.userService.getUser(id, true);
    const { date, ...dataToCreateBuilding } = data;

    if (user && user.building.length > 3)
      throw new ConflictException('Your account has too many advertisments');
    const building = await this.prisma.building.create({
      data: {
        ...dataToCreateBuilding,
        userId: id,
        booking: {
          create: {
            deadline: new Date(date),
          },
        },
      },
    });

    return building;
  }

  // first page provides page as 0, second as 1, third as 2, etc...
  async getAllBuildings(page: number, filters: FiltersDto) {
    return await this.prisma.building.findMany({
      take: 10,
      skip: 10 * page,
      where: {
        city: { contains: filters.city },
        AND: [
          { estimatedcost: { gte: filters.gt } },
          { estimatedcost: { lte: filters.lt } },
        ],
        zipcode: { contains: filters.zipcode },
      },
      include: {
        booking: true,
      },
    });
  }

  async getBuilding(id: number) {
    return await this.prisma.building.findFirst({
      where: {
        id: id,
      },
    });
  }

  async removeBuilding(id: number, userId: number) {
    await this.checkBuilding(id, userId);
    return this.prisma.building.delete({
      where: {
        id: id,
      },
    });
  }

  async updateBuilding({ id, ...data }: UpdateBuildingDto, userId: number) {
    await this.checkBuilding(id, userId);
    return this.prisma.building.update({
      where: {
        id: id,
      },
      data: { ...data },
    });
  }

  async checkBuilding(id: number, userId: number) {
    const building = await this.getBuilding(id);
    if (!building) throw new NotFoundException();

    const ownerId = building.userId;
    if (ownerId !== userId) throw new UnauthorizedException('Not right access');
  }
}
