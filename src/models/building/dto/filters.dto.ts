import { z } from 'zod';

export const filterBuildingSchema = z.object({
  gt: z.string().optional(),
  lt: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
});

export type filterBuildingDto = z.infer<typeof filterBuildingSchema>;
