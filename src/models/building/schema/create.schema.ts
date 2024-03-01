import { z } from 'zod';
export const createBuildingSchema = z
  .object({
    title: z.string(),
    adress: z.string(),
    city: z.string(),
    zipcode: z.string(),
    description: z.string(),
    estimatedcost: z.string(),
  })
  .required();
