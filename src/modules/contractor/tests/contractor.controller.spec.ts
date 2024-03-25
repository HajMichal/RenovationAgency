import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ContractorService } from '../contractor.service';
import { ContractorController } from '../contractor.controller';

const userPayload = {
  id: 3,
  email: 'wojtek@mail.com',
  phone: '123123123',
};

const contractorOutput = {
  id: 2,
  companyName: 'Wojciech Kaczmarek',
  companyEmail: 'wojtek@mail.com',
  companyPhone: '112211333',
  companyAddress: 'ul. Stokrotki 4',
  nip: null,
  createdat: new Date('2024-03-25T13:05:20.923Z'),
  userId: 3,
};
const providedFakeData = {
  name: 'Wojciech Kaczmarek',
  email: 'wojtek@mail.com',
  phone: '112211333',
  address: 'ul. Stokrotki 4',
};

describe('Contractor Controller', () => {
  let contractorController: ContractorController;
  let contractorService: ContractorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ContractorController],
      providers: [ContractorService, PrismaService, UserService, JwtService],
    }).compile();

    contractorController =
      module.get<ContractorController>(ContractorController);
    contractorService = module.get<ContractorService>(ContractorService);
  });

  describe('createContractorProfile', () => {
    it('should return created contractor', async () => {
      jest
        .spyOn(contractorService, 'createContractor')
        .mockImplementation(() => Promise.resolve(contractorOutput));

      expect(
        await contractorController.createContractorProfile(
          providedFakeData,
          userPayload,
        ),
      ).toBe(contractorOutput);
    });
  });
  describe('updateContractorProfile', () => {
    it('should return update contractor', async () => {
      jest
        .spyOn(contractorService, 'updateContractorPorfile')
        .mockImplementation(() => Promise.resolve(contractorOutput));

      expect(
        await contractorController.updateContractorProfile(
          providedFakeData,
          userPayload,
        ),
      ).toBe(contractorOutput);
    });
  });
  describe('getProfile', () => {
    it('should return contractor', async () => {
      jest
        .spyOn(contractorService, 'getContractor')
        .mockImplementation(() => Promise.resolve(contractorOutput));

      expect(
        await contractorController.updateContractorProfile(
          providedFakeData,
          userPayload,
        ),
      ).toEqual(contractorOutput);
    });
  });
});
