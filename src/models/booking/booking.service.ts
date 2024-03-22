import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { BookBuildingDto } from './dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async bookContractor({ buildingId, contractorId }: BookBuildingDto) {
    return await this.prisma.booking.update({
      where: {
        buildingId,
      },
      data: {
        contractor: {
          connect: {
            id: contractorId,
          },
        },
      },
    });
  }

  async removeBookedContractor({ buildingId, contractorId }: BookBuildingDto) {
    return await this.prisma.booking.update({
      where: {
        buildingId,
      },
      data: {
        contractor: {
          disconnect: {
            id: contractorId,
          },
        },
      },
    });
  }
}
