import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { BuildsService } from './builds.service';
import { CreateBuildingDto } from './dto';
import { ZodValidationPipe } from 'src/zod/ZodValidationPipe';
import { createBuildingSchema } from './schema';

@Controller('builds')
export class BuildsController {
  constructor(private buildsService: BuildsService) {}

  @Post('create')
  @UsePipes(new ZodValidationPipe(createBuildingSchema))
  createBuilding(@Body() createBuildingData: CreateBuildingDto) {
    return this.buildsService.createBuilding(createBuildingData);
  }
}
