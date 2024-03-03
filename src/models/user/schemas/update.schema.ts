import { z } from 'zod';
export const updateSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  adress: z.string().optional(),
  password: z.string().optional(),
});
