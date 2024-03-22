import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { booking } from 'src/common/constatns/modelsEndpoints';
import { BookingService } from './booking.service';
import { BookBuildingDto, bookBuildingSchema } from './dto';
import { DataValidationPipe } from 'src/common/pipes/validateData.pipe';
import { BookBuildingGuard } from 'src/common/auth/bookBuilding.guard';

@UsePipes(new DataValidationPipe(bookBuildingSchema))
@Controller(booking)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @UseGuards(BookBuildingGuard)
  @Post()
  bookContractor(@Body() contractorData: BookBuildingDto) {
    return this.bookingService.bookContractor(contractorData);
  }

  @Delete()
  removeBookedContractor(@Body() contractorData: BookBuildingDto) {
    return this.bookingService.removeBookedContractor(contractorData);
  }
}
