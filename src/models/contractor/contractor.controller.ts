import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
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
  updateContractorProfile(
    @Body(new DataValidationPipe(createContractorSchema))
    contractorData: CreateContractorDto,
    @User() user: UserDto,
  ) {
    return this.contractorService.updateContractorPorfile(
      contractorData,
      user.id,
    );
  }

  @Patch('update/bookBuilding')
  bookBuilding(
    @Body(new DataValidationPipe(bookBuildingSchema))
    bookingData: BookBuildingDto,
    @User() user: UserDto,
  ) {
    return this.contractorService.bookBuilding(bookingData, user.id);
  }

  @Get()
  getProfile(@User() user: UserDto): Promise<Contractor | null> {
    return this.contractorService.getContractor(user.id);
  }
}
