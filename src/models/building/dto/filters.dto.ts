import { z } from 'zod';

export const filterBuildingSchema = z.object({
  gtPrice: z.string().optional(),
  ltPrice: z.string().optional(),
  gtArea: z.string().optional(),
  ltArea: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
});

export type filterBuildingDto = z.infer<typeof filterBuildingSchema>;
