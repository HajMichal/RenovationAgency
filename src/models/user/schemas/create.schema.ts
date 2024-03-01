import { z } from 'zod';
export const createUserSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    adress: z.string(),
    password: z.string(),
  })
  .required();
