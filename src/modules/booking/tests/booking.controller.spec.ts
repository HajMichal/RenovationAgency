import { Test } from '@nestjs/testing';
import { BookingService } from '../booking.service';
import { BookingController } from '../booking.controller';
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

describe('Booking controller', () => {
  let bookingService: BookingService;
  let bookingController: BookingController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [BookingService, PrismaService, JwtService],
    }).compile();

    bookingService = module.get<BookingService>(BookingService);
    bookingController = module.get<BookingController>(BookingController);
  });

  describe('bookContractor', () => {
    it('should return booked term', async () => {
      jest
        .spyOn(bookingService, 'bookContractor')
        .mockImplementation(() => Promise.resolve(fakeBookingOutput));

      expect(await bookingController.bookContractor(providedFakeData)).toBe(
        fakeBookingOutput,
      );
    });
  });
  describe('removeBookedContractor', () => {
    it('should removed contractor from building', async () => {
      jest
        .spyOn(bookingService, 'removeBookedContractor')
        .mockImplementation(() =>
          Promise.resolve({ ...fakeBookingOutput, contractorId: null }),
        );

      expect(
        await bookingController.removeBookedContractor(providedFakeData),
      ).toEqual({ ...fakeBookingOutput, contractorId: null });
    });
  });
});
