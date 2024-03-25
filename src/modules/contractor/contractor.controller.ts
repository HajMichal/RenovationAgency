import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { contractor } from '../../common/constatns/modelsEndpoints';
import { ContractorService } from './contractor.service';
import { CreateContractorDto, createContractorSchema } from './dto/create.dto';
import { User } from '../../common/decorators';
import { UserDto } from '../user/dto';
import { DataValidationPipe } from '../../common/pipes/validateData.pipe';
import { Contractor } from '@prisma/client';

@Controller(contractor)
export class ContractorController {
  constructor(private contractorService: ContractorService) {}

  @Post()
  createContractorProfile(
    @Body(new DataValidationPipe(createContractorSchema))
    contractorData: CreateContractorDto,
    @User() user: UserDto,
  ) {
    return this.contractorService.createContractor(contractorData, user.id);
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

  @Get()
  getProfile(@User() user: UserDto): Promise<Contractor | null> {
    return this.contractorService.getContractor(user.id);
  }
}
