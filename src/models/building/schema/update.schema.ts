import { z } from 'zod';
export const updateBuildingSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  adress: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
  description: z.string().optional(),
  estimatedcost: z.string().optional(),
});
