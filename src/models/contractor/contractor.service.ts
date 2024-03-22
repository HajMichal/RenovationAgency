import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreateContractorDto, BookBuildingDto } from './dto';

@Injectable()
export class ContractorService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createContractor(data: CreateContractorDto, userId: number) {
    const user = await this.userService.getUser(userId);
    const isContractor = await this.findContractor(
      data.email ?? user?.email,
      data.phone ?? user?.phone,
    );
    if (!user) throw new NotFoundException('User not found');
    if (isContractor) {
      throw new ConflictException('Contractor with this data is already taken');
    }

    return await this.prisma.contractor.create({
      data: {
        companyName: data.email ?? user.name,
        companyAddress: data.address ?? user.address,
        companyEmail: data.email ?? user.email,
        companyPhone: data.phone ?? user.phone,
        nip: data.nip,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async updateContractorPorfile(data: CreateContractorDto, userId: number) {
    return await this.prisma.contractor.update({
      where: {
        userId: userId,
      },
      data: {
        companyAddress: data?.address,
        companyEmail: data?.email,
        companyName: data?.name,
        companyPhone: data?.phone,
        nip: data?.nip,
      },
    });
  }

  async bookBuilding(data: BookBuildingDto, userId: number) {
    return await this.prisma.booking.update({
      where: {
        id: data.bookingId,
      },
      data: {
        contractor: {
          connect: {
            userId: userId,
          },
        },
      },
    });
  }

  async getContractor(userId: number) {
    return await this.prisma.contractor.findFirst({
      where: {
        userId: userId,
      },
    });
  }

  private async findContractor(email?: string, phone?: string) {
    return await this.prisma.contractor.findFirst({
      where: {
        OR: [{ companyEmail: email }, { companyPhone: phone }],
      },
    });
  }
}
