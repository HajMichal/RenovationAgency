import {
  Body,
  Headers,
  Controller,
  Post,
  UsePipes,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BuildsService } from './builds.service';
import { CreateBuildingDto, UpdateBuildingDto } from './dto';
import { DataValidationPipe } from 'src/common/pipes/validateData.pipe';
import { createBuildingSchema, updateBuildingSchema } from './schema';

@Controller('builds')
export class BuildsController {
  constructor(private buildsService: BuildsService) {}

  @Post('create')
  @UsePipes(new DataValidationPipe(createBuildingSchema))
  createBuilding(
    @Headers('Authorization') auth: string,
    @Body() createBuildingData: CreateBuildingDto,
  ) {
    return this.buildsService.createBuilding(createBuildingData, auth);
  }

  @Patch('update')
  @UsePipes(new DataValidationPipe(updateBuildingSchema))
  updateBuilding(@Body() updateBuildingData: UpdateBuildingDto) {
    return this.buildsService.updateBuilding(updateBuildingData);
  }

  @Delete('remove/:id')
  removeBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.buildsService.removeBuilding(id);
  }
}
