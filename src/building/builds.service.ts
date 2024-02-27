import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBuildingDto } from './dto';

@Injectable()
export class BuildsService {
  constructor(private prisma: PrismaService) {}

  async createBuilding(data: CreateBuildingDto) {
    return data;
  }
}
