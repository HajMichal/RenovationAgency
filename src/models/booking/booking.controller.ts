import { Controller } from '@nestjs/common';
import { booking } from 'src/common/constatns/modelsEndpoints';

@Controller(booking)
export class BookingController {
  constructor() {}
}
