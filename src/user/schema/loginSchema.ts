import { z } from 'zod';

export const loginSchema = z
  .object({
    login: z.string(),
    password: z.string(),
  })
  .required();

export type LoginSchema = z.infer<typeof loginSchema>;
