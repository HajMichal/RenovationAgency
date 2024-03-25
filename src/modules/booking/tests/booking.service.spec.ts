import { Test } from '@nestjs/testing';
import { BookingService } from '../booking.service';
import { BookBuildingDto } from '../dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

const fakeBookingOutput = {
  id: 7,
  deadline: new Date('2024-05-13T22:00:00.000Z'),
  buildingId: 8,
  contractorId: 2,
};
const providedFakeData: BookBuildingDto = {
  contractorId: 2,
  buildingId: 8,
};

const mockPrisma = {
  booking: {
    update: jest.fn().mockResolvedValue(fakeBookingOutput),
  },
};

describe('Booking Service', () => {
  let bookingService: BookingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BookingService,
        JwtService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    bookingService = module.get<BookingService>(BookingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('bookContractor', () => {
    it('should connect contractor with booking term', async () => {
      const response = await bookingService.bookContractor(providedFakeData);

      expect(prisma.booking.update).toHaveBeenCalledTimes(1);
      expect(prisma.booking.update).toHaveBeenCalledWith({
        where: {
          buildingId: providedFakeData.buildingId,
        },
        data: {
          contractor: {
            connect: {
              id: providedFakeData.contractorId,
            },
          },
        },
      });
      expect(response).toBe(fakeBookingOutput);
    });
  });
  describe('removeBookedContractor', () => {
    it('should disconnect contractor from booking term', async () => {
      const response =
        await bookingService.removeBookedContractor(fakeBookingOutput);

      expect(prisma.booking.update).toHaveBeenCalledTimes(2);
      expect(prisma.booking.update).toHaveBeenCalledWith({
        where: {
          buildingId: providedFakeData.buildingId,
        },
        data: {
          contractor: {
            disconnect: {
              id: providedFakeData.contractorId,
            },
          },
        },
      });
      expect(response).toBe(fakeBookingOutput);
    });
  });
});
