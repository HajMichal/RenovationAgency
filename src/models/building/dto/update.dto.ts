import { z } from 'zod';

export const updateBuildingSchema = z.object({
  buildingId: z.number(),
  title: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
  description: z.string().optional(),
  estimatedCost: z.string().optional(),
  estimatedArea: z.string().optional(),
});

export type UpdateBuildingDto = z.infer<typeof updateBuildingSchema>;
