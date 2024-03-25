import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { booking } from '../../common/constatns/modelsEndpoints';
import { BookingService } from './booking.service';
import { BookBuildingDto, bookBuildingSchema } from './dto';
import { DataValidationPipe } from '../../common/pipes/validateData.pipe';
import { BookBuildingGuard } from '../../common/auth/booking/bookBuilding.guard';
import { RemoveBookingGuard } from '../../common/auth/booking/removeBooking.guard';

@UsePipes(new DataValidationPipe(bookBuildingSchema))
@Controller(booking)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @UseGuards(BookBuildingGuard)
  @Post()
  bookContractor(@Body() contractorData: BookBuildingDto) {
    return this.bookingService.bookContractor(contractorData);
  }

  @UseGuards(RemoveBookingGuard)
  @Delete()
  removeBookedContractor(@Body() contractorData: BookBuildingDto) {
    return this.bookingService.removeBookedContractor(contractorData);
  }
}
