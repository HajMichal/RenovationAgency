import { Body, Controller, Get, Patch, Post, UsePipes } from '@nestjs/common';
import { contractor } from 'src/common/constatns/modelsEndpoints';
import { ContractorService } from './contractor.service';
import { CreateContractorDto, createContractorSchema } from './dto/create.dto';
import { BookBuildingDto, bookBuildingSchema } from './dto/book.dto';
import { User } from 'src/common/decorators';
import { UserDto } from '../user/dto';
import { DataValidationPipe } from 'src/common/pipes/validateData.pipe';
import { Contractor } from '@prisma/client';

@Controller(contractor)
export class ContractorController {
  constructor(private contractorService: ContractorService) {}

  @Post()
  createContractorProfile(
    @Body(new DataValidationPipe(createContractorSchema))
    userData: CreateContractorDto,
    @User() user: UserDto,
  ) {
    return this.contractorService.createContractor(userData, user.id);
  }

  @Patch('update/data')
  @UsePipes(new DataValidationPipe(createContractorSchema))
  updateContractorProfile(@Body() userData: CreateContractorDto) {
    return this.contractorService.updateContractorPorfile(userData);
  }

  @Patch('update/bookBuilding')
  @UsePipes(new DataValidationPipe(bookBuildingSchema))
  bookBuilding(@Body() bookingData: BookBuildingDto) {
    return this.contractorService.bookBuilding(bookingData);
  }

  @Get()
  getProfile(@User() user: UserDto): Promise<Contractor | null> {
    return this.contractorService.getContractor(user.id);
  }
}
