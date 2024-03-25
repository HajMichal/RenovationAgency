import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ContractorService } from '../contractor.service';
import { ContractorController } from '../contractor.controller';
import { ConflictException, NotFoundException } from '@nestjs/common';

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

const fakeUser = {
  id: 2,
  name: 'Damian Wójcik',
  email: 'damian@mail.com',
  phone: '123123123',
  address: 'ul. Kościuszki 4/10',
  password: '$2b$10$bB578qHx4dlxcPdXIp9Iburxv3uvk/qUgnOH.iBg7/N9ZZ.9opxa2',
  createdat: new Date('2024-03-21T16:03:12.869Z'),
  contractor: null,
  building: [],
};

const prismaMock = {
  contractor: {
    findUnique: jest.fn().mockResolvedValue(contractorOutput),
    findFirst: jest.fn().mockResolvedValue(contractorOutput),
    create: jest.fn().mockReturnValue(contractorOutput),
    update: jest.fn().mockResolvedValue(contractorOutput),
    delete: jest.fn(),
  },
};

describe('Contractor Service', () => {
  let contractorService: ContractorService;
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ContractorController],
      providers: [
        ContractorService,
        UserService,
        JwtService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    contractorService = module.get<ContractorService>(ContractorService);
    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createContractor', () => {
    const userId = 2;
    it('should return created contractor', async () => {
      jest
        .spyOn(userService, 'getUser')
        .mockImplementation(() => Promise.resolve(fakeUser));
      jest
        .spyOn(contractorService, 'findContractor')
        .mockImplementation(() => Promise.resolve(null));

      const response = await contractorService.createContractor(
        { ...providedFakeData, nip: undefined },
        userId,
      );

      expect(prisma.contractor.create).toHaveBeenCalledTimes(1);
      expect(prisma.contractor.create).toHaveBeenCalledWith({
        data: {
          companyName: providedFakeData.email,
          companyAddress: providedFakeData.address,
          companyEmail: providedFakeData.email,
          companyPhone: providedFakeData.phone,
          nip: undefined,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      expect(response).toBe(contractorOutput);
    });

    it('should throw a NotFoundException', () => {
      jest
        .spyOn(userService, 'getUser')
        .mockImplementation(() => Promise.resolve(null));
      jest
        .spyOn(contractorService, 'findContractor')
        .mockImplementation(() => Promise.resolve(null));

      const response = contractorService.createContractor(
        { ...providedFakeData, nip: undefined },
        userId,
      );

      expect(async () => await response).rejects.toThrow(NotFoundException);
    });

    it('should throw a ConflictException', () => {
      jest
        .spyOn(userService, 'getUser')
        .mockImplementation(() => Promise.resolve(fakeUser));
      jest
        .spyOn(contractorService, 'findContractor')
        .mockImplementation(() => Promise.resolve(contractorOutput));

      const response = contractorService.createContractor(
        { ...providedFakeData, nip: undefined },
        userId,
      );

      expect(async () => await response).rejects.toThrow(ConflictException);
    });
  });

  describe('updateContractorPorfile', () => {
    it('should return updated contractor', async () => {
      const userId = 3;
      const response = await contractorService.updateContractorPorfile(
        {
          ...providedFakeData,
          nip: undefined,
        },
        userId,
      );

      expect(prisma.contractor.update).toHaveBeenCalledTimes(1);
      expect(prisma.contractor.update).toHaveBeenCalledWith({
        where: {
          userId: userId,
        },
        data: {
          companyAddress: providedFakeData.address,
          companyEmail: providedFakeData.email,
          companyName: providedFakeData.name,
          companyPhone: providedFakeData.phone,
        },
      });
      expect(response).toBe(contractorOutput);
    });
  });

  describe('getContractor', () => {
    it('should return single contractor', async () => {
      const userId = 3;
      const response = await contractorService.getContractor(userId);

      expect(prisma.contractor.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.contractor.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
        },
      });
      expect(response).toBe(contractorOutput);
    });
  });
  describe('findContractor', () => {
    it('should return single contractor by email or phone', async () => {
      const response = await contractorService.findContractor(
        contractorOutput.companyEmail,
        contractorOutput.companyPhone,
      );
      expect(prisma.contractor.findFirst).toHaveBeenCalledTimes(2);
      expect(prisma.contractor.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { companyEmail: contractorOutput.companyEmail },
            { companyPhone: contractorOutput.companyPhone },
          ],
        },
      });
      expect(response).toBe(contractorOutput);
    });
  });
});
