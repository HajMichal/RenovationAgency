import {
  Body,
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Get,
  Query,
  UsePipes,
} from '@nestjs/common';
import {
  CreateBuildingDto,
  createBuildingSchema,
  filterBuildingDto,
  UpdateBuildingDto,
  updateBuildingSchema,
} from './dto';
import { DataValidationPipe } from '../../common/pipes/validateData.pipe';
import { building } from '../../common/constatns/modelsEndpoints';
import { User } from '../../common/decorators';
import { UserDto } from '../user/dto';
import { BuildingsService } from './building.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller(building)
export class BuildingsController {
  constructor(private buildingsService: BuildingsService) {}

  @Post('create')
  createBuilding(
    @Body(new DataValidationPipe(createBuildingSchema))
    createBuildingData: CreateBuildingDto,
    @User() user: UserDto,
  ) {
    return this.buildingsService.createBuilding(createBuildingData, user.id);
  }

  @Patch('update')
  @UsePipes(new DataValidationPipe(updateBuildingSchema))
  updateBuilding(@Body() updateBuildingData: UpdateBuildingDto) {
    return this.buildingsService.updateBuilding(updateBuildingData);
  }

  @Delete('remove/:id')
  removeBuilding(@Param('id', ParseIntPipe) id: number) {
    return this.buildingsService.removeBuilding(id);
  }

  @Public()
  @Get(':page')
  getBuildings(
    @Param('page', ParseIntPipe) page: number,
    @Query() filters: filterBuildingDto,
  ) {
    return this.buildingsService.getAllBuildings(page, filters);
  }

  @Public()
  @Get(':buildingId')
  getSingleBuilding(@Param('buildingId', ParseIntPipe) buildingId: number) {
    return this.buildingsService.getBuilding(buildingId);
  }
}
