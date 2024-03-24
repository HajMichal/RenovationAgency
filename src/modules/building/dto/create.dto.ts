import { z } from 'zod';

export const createBuildingSchema = z
  .object({
    title: z.string(),
    address: z.string(),
    city: z.string(),
    zipcode: z.string(),
    description: z.string(),
    estimatedArea: z.string(),
    estimatedCost: z.string(),
    date: z.string(),
  })
  .required();

export type CreateBuildingDto = z.infer<typeof createBuildingSchema>;
