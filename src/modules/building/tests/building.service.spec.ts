import { Test } from '@nestjs/testing';
import { BuildingsService } from '../building.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateBuildingDto } from '../dto';
import { ConflictException } from '@nestjs/common';

const fakeBuildingsList = [
  {
    id: 1,
    title: 'Remont parteru w domu jednorodzinnym powierzchnia ok 50m2',
    address: 'ul. Płaska 4',
    city: 'Bielsko-Biała',
    zipcode: '43-300',
    description:
      'Budynek zaprojektowano w technologii tradycyjnej, murowanej, ze stropem gęstożebrowym TERIVA I, opartym na ścianach nośnych. Dach dwuspadowy o konstrukcji drewnianej płatwiowo – kleszczowy. Posadowienie budynku na ławach żelbetowych monolitycznych.',
    estimatedCost: '50000',
    estimatedArea: '50',
    userId: 2,
  },
  {
    id: 2,
    title: 'Remont parteru w domu jednorodzinnym powierzchnia ok 50m2',
    address: 'ul. Płaska 4',
    city: 'Bielsko-Biała',
    zipcode: '43-300',
    description:
      'Budynek zaprojektowano w technologii tradycyjnej, murowanej, ze stropem gęstożebrowym TERIVA I, opartym na ścianach nośnych. Dach dwuspadowy o konstrukcji drewnianej płatwiowo – kleszczowy. Posadowienie budynku na ławach żelbetowych monolitycznych.',
    estimatedCost: '50000',
    estimatedArea: '50',
    userId: 2,
  },
  {
    id: 3,
    title: 'Remont parteru w domu jednorodzinnym powierzchnia ok 50m2',
    address: 'ul. Płaska 4',
    city: 'Bielsko-Biała',
    zipcode: '43-300',
    description:
      'Budynek zaprojektowano w technologii tradycyjnej, murowanej, ze stropem gęstożebrowym TERIVA I, opartym na ścianach nośnych. Dach dwuspadowy o konstrukcji drewnianej płatwiowo – kleszczowy. Posadowienie budynku na ławach żelbetowych monolitycznych.',
    estimatedCost: '50000',
    estimatedArea: '50',
    userId: 2,
  },
  {
    id: 4,
    title: 'Remont parteru w domu jednorodzinnym powierzchnia ok 50m2',
    address: 'ul. Płaska 4',
    city: 'Bielsko-Biała',
    zipcode: '43-300',
    description:
      'Budynek zaprojektowano w technologii tradycyjnej, murowanej, ze stropem gęstożebrowym TERIVA I, opartym na ścianach nośnych. Dach dwuspadowy o konstrukcji drewnianej płatwiowo – kleszczowy. Posadowienie budynku na ławach żelbetowych monolitycznych.',
    estimatedCost: '50000',
    estimatedArea: '50',
    userId: 2,
  },
];

const userWithBuildings = {
  id: 2,
  name: 'Damian Wójcik',
  email: 'damian@mail.com',
  phone: '123123123',
  address: 'ul. Kościuszki 4/10',
  password: '$2b$10$bB578qHx4dlxcPdXIp9Iburxv3uvk/qUgnOH.iBg7/N9ZZ.9opxa2',
  createdat: new Date('2024-03-21T16:03:12.869Z'),
  contractor: null,
  building: fakeBuildingsList.slice(1, 2),
};
const userWithBuildingsLimit = {
  id: 2,
  name: 'Damian Wójcik',
  email: 'damian@mail.com',
  phone: '123123123',
  address: 'ul. Kościuszki 4/10',
  password: '$2b$10$bB578qHx4dlxcPdXIp9Iburxv3uvk/qUgnOH.iBg7/N9ZZ.9opxa2',
  createdat: new Date('2024-03-21T16:03:12.869Z'),
  contractor: null,
  building: fakeBuildingsList,
};

const providedFakeData: CreateBuildingDto = {
  title: 'Remont mieszkania powierzchnia',
  address: 'ul. Warszawska 4/10',
  city: 'Bielsko-Biała',
  zipcode: '43-300',
  description:
    'Projektując budynek, postawiliśmy na bewzględną solidność. Wykorzystując tradycyjną technologię murowaną oraz strop gęstożebrowy TERIVA I, zapewniamy nie tylko wyjątkową wytrzymałość, ale także komfort użytkowania',
  estimatedArea: '80',
  estimatedCost: '85000',
  date: '2024-03-21T16:03:12.869Z',
};

const getAllFakeBuildings = [
  {
    id: 8,
    title: 'Remont parteru w domu jednorodzinnym powierzchnia ok 50m2',
    address: 'ul. Płaska 4',
    city: 'Bielsko-Biała',
    zipcode: '43-300',
    description:
      'Budynek zaprojektowano w technologii tradycyjnej, murowanej, ze stropem gęstożebrowym TERIVA I, opartym na ścianach nośnych. Dach dwuspadowy o konstrukcji drewnianej płatwiowo – kleszczowy. Posadowienie budynku na ławach żelbetowych monolitycznych.',
    estimatedCost: '35000',
    estimatedArea: '50',
    userId: 3,
    booking: {
      id: 7,
      deadline: new Date('2024-05-13T22:00:00.000Z'),
      buildingId: 8,
      contractorId: null,
    },
  },
];

const mockPrisma = {
  building: {
    create: jest.fn().mockReturnValue(userWithBuildings),
    findMany: jest.fn().mockResolvedValue(getAllFakeBuildings),
    findFirst: jest.fn().mockResolvedValue(getAllFakeBuildings[0]),
    update: jest.fn().mockResolvedValue(providedFakeData),
    delete: jest.fn(),
  },
};

describe('Building Service', () => {
  let buildingService: BuildingsService;
  let userService: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BuildingsService,
        UserService,
        JwtService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    buildingService = module.get<BuildingsService>(BuildingsService);
    userService = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('createBuilding', () => {
    it('should create new building', async () => {
      const { date, ...restData } = providedFakeData;

      jest
        .spyOn(userService, 'getUser')
        .mockImplementation(() => Promise.resolve(userWithBuildings));

      const response = await buildingService.createBuilding(
        providedFakeData,
        2,
      );

      expect(prisma.building.create).toHaveBeenCalledTimes(1);
      expect(prisma.building.create).toHaveBeenCalledWith({
        data: {
          ...restData,
          userId: 2,
          booking: {
            create: {
              deadline: new Date(date),
            },
          },
        },
      });

      expect(response).toEqual(userWithBuildings);
    });

    it('should throw conflictException', () => {
      jest
        .spyOn(userService, 'getUser')
        .mockImplementation(() => Promise.resolve(userWithBuildingsLimit));

      expect(
        async () => await buildingService.createBuilding(providedFakeData, 2),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getAllBuildings', () => {
    it('should return an array of buildings', async () => {
      const filters = {
        city: 'Bielsko',
        gtPrice: '10000',
        ltPrice: '100000',
        gtArea: '10',
        ltArea: '99',
        zipcode: '43-300',
      };
      const response = await buildingService.getAllBuildings(0, filters);

      expect(prisma.building.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.building.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 10 * 0,
        where: {
          city: { contains: filters.city },
          AND: [
            { estimatedCost: { gte: filters.gtPrice } },
            { estimatedCost: { lte: filters.ltPrice } },
            { estimatedArea: { gte: filters.gtArea } },
            { estimatedArea: { lte: filters.ltArea } },
          ],
          zipcode: { contains: filters.zipcode },
        },
        include: {
          booking: true,
        },
      });
      expect(response).toEqual(getAllFakeBuildings);
    });
  });

  describe('getBuilding', () => {
    it('should return single Building', async () => {
      const response = await buildingService.getBuilding(1);

      expect(prisma.building.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.building.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        include: {
          booking: true,
          user: true,
        },
      });
      expect(response).toEqual(getAllFakeBuildings[0]);
    });
  });

  describe('removeBuilding', () => {
    it('should return successful message', async () => {
      const response = await buildingService.removeBuilding(1);

      expect(prisma.building.delete).toHaveBeenCalledTimes(1);
      expect(prisma.building.delete).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        include: {
          booking: {
            where: {
              buildingId: 1,
            },
          },
        },
      });
      expect(response).toEqual({ message: 'Building was deleted correctly' });
    });
  });

  describe('updateBuilding', () => {
    it('should update Building', async () => {
      const response = await buildingService.updateBuilding({
        buildingId: 8,
        ...providedFakeData,
      });

      expect(prisma.building.update).toHaveBeenCalledTimes(1);
      expect(prisma.building.update).toHaveBeenCalledWith({
        where: {
          id: 8,
        },
        data: { ...providedFakeData },
      });
      expect(response).toBe(providedFakeData);
    });
  });
});
