import { z } from 'zod';
export const bookBuildingSchema = z.object({
  bookingId: z.number(),
  buildingId: z.string(),
  contractorId: z.string().optional(),
});

export type BookBuildingDto = z.infer<typeof bookBuildingSchema>;
