import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UserService } from 'src/models/user/user.service';
import { CreateBuildingDto, filterBuildingDto, UpdateBuildingDto } from './dto';

@Injectable()
export class BuildingsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createBuilding(data: CreateBuildingDto, userId: number) {
    const user = await this.userService.getUser(userId, true);
    const { date, ...dataToCreateBuilding } = data;

    if (user && user.building.length > 3)
      throw new ConflictException('Your account has too many advertisments');

    const building = await this.prisma.building.create({
      data: {
        ...dataToCreateBuilding,
        userId: userId,
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
  async getAllBuildings(page: number, filters: filterBuildingDto) {
    return await this.prisma.building.findMany({
      take: 10,
      skip: 10 * page,
      where: {
        city: { contains: filters.city },
        AND: [
          { estimatedCost: { gte: filters.gtPrice } },
          { estimatedCost: { lte: filters.ltPrice } },
          { estimatedArea: { gte: filters.gtArea } },
          { estimatedArea: { lte: filters.ltArea } },
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
      include: {
        booking: {
          where: {
            buildingId: id,
          },
        },
      },
    });
  }

  async updateBuilding({ buildingId, ...data }: UpdateBuildingDto) {
    return await this.prisma.building.update({
      where: {
        id: buildingId,
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
