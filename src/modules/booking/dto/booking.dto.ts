import { z } from 'zod';

export const bookBuildingSchema = z
  .object({
    contractorId: z.number(),
    buildingId: z.number(),
  })
  .required();

export type BookBuildingDto = z.infer<typeof bookBuildingSchema>;
