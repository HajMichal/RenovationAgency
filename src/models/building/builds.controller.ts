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
import { building } from 'src/common/constatns/modelsEndpoints';
import { User } from 'src/common/decorators';
import { UserDto } from '../user/dto/';

@Controller(building)
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
  updateBuilding(
    @Body() updateBuildingData: UpdateBuildingDto,
    @User() user: UserDto,
  ) {
    return this.buildsService.updateBuilding(updateBuildingData, user.id);
  }

  @Delete('remove/:id')
  removeBuilding(@Param('id', ParseIntPipe) id: number, @User() user: UserDto) {
    return this.buildsService.removeBuilding(id, user.id);
  }
}
