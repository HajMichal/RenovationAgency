/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Get,
  Query,
} from '@nestjs/common';
import {
  CreateBuildingDto,
  createBuildingSchema,
  filterBuildingDto,
  UpdateBuildingDto,
  updateBuildingSchema,
} from './dto';
import { BuildingsService } from './building.service';
import { DataValidationPipe } from 'src/common/pipes/validateData.pipe';
import { building } from 'src/common/constatns/modelsEndpoints';
import { User } from 'src/common/decorators';
import { UserDto } from '../user/dto';
import { Public } from 'src/common/auth/auth.guard';

@Controller(building)
export class BuildingsController {
  constructor(private BuildingsService: BuildingsService) {}

  @Post('create')
  @UsePipes(new DataValidationPipe(createBuildingSchema))
  createBuilding(
    @Body() createBuildingData: CreateBuildingDto,
    @User() user: UserDto,
  ) {
    return this.BuildingsService.createBuilding(createBuildingData, user.id);
  }

  @Patch('update')
  @UsePipes(new DataValidationPipe(updateBuildingSchema))
  updateBuilding(
    @Body() updateBuildingData: UpdateBuildingDto,
    @User() user: UserDto,
  ) {
    return this.BuildingsService.updateBuilding(updateBuildingData, user.id);
  }

  @Delete('remove/:id')
  removeBuilding(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    return this.BuildingsService.removeBuilding(id, user.id);
  }

  @Public()
  @Get(':page')
  getBuildings(
    @Param('page', ParseIntPipe) page: number,
    @Query() filters: filterBuildingDto,
  ) {
    return this.BuildingsService.getAllBuildings(page, filters);
  }
}
