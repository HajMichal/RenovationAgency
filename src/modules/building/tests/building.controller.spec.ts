import { Test } from '@nestjs/testing';
import { BuildingsController } from '../building.controller';
import { BuildingsService } from '../building.service';
import { CreateBuildingDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserService } from '../../../modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

const fakeBuilding = {
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
};
const createBuildingData: CreateBuildingDto = {
  title: 'Remont mieszkania powierzchnia',
  address: 'ul. Warszawska 4/10',
  city: 'Bielsko-Biała',
  zipcode: '43-300',
  description:
    'Projektując budynek, postawiliśmy na bewzględną solidność. Wykorzystując tradycyjną technologię murowaną oraz strop gęstożebrowy TERIVA I, zapewniamy nie tylko wyjątkową wytrzymałość, ale także komfort użytkowania',
  estimatedArea: '80',
  estimatedCost: '85000',
  date: Date.now().toString(),
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

const userPayload = {
  id: 2,
  email: 'damian@mail.com',
  phone: '123123123',
};

describe('Building Controller', () => {
  let buildingController: BuildingsController;
  let buildingService: BuildingsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BuildingsController],
      providers: [BuildingsService, PrismaService, UserService, JwtService],
    }).compile();

    buildingController = module.get<BuildingsController>(BuildingsController);
    buildingService = module.get<BuildingsService>(BuildingsService);
  });

  describe('createBuilding', () => {
    it('should return created building', async () => {
      jest
        .spyOn(buildingService, 'createBuilding')
        .mockImplementation(() => Promise.resolve(fakeBuilding));

      expect(
        await buildingController.createBuilding(
          createBuildingData,
          userPayload,
        ),
      ).toBe(fakeBuilding);
    });
  });

  describe('updateBuilding', () => {
    it('should return updated building', async () => {
      jest
        .spyOn(buildingService, 'updateBuilding')
        .mockImplementation(() => Promise.resolve(fakeBuilding));

      expect(
        await buildingController.updateBuilding({
          buildingId: 1,
          title: 'Remont parteru w domu jednorodzinnym powierzchnia ok 50m2',
        }),
      ).toBe(fakeBuilding);
    });
  });
  describe('removeBuilding', () => {
    it('should delete building and display successfull message', async () => {
      jest.spyOn(buildingService, 'removeBuilding').mockImplementation(() =>
        Promise.resolve({
          message: 'Building was deleted correctly',
        }),
      );
      expect(await buildingController.removeBuilding(1)).toEqual({
        message: 'Building was deleted correctly',
      });
    });
  });
  describe('getBuildings', () => {
    it('should return an array with buildings', async () => {
      jest
        .spyOn(buildingService, 'getAllBuildings')
        .mockImplementation(() => Promise.resolve(getAllFakeBuildings));
      expect(await buildingController.getBuildings(1, {})).toBe(
        getAllFakeBuildings,
      );
    });
    it('should return an empty array', async () => {
      jest
        .spyOn(buildingService, 'getAllBuildings')
        .mockImplementation(() => Promise.resolve([]));
      expect(
        await buildingController.getBuildings(1, { gtPrice: '100000' }),
      ).toEqual([]);
    });
  });
});
