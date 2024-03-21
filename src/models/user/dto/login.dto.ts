import { z } from 'zod';
export const loginSchema = z
  .object({
    login: z.string(), // email or phone
    password: z.string(),
  })
  .required();

export type LoginDto = z.infer<typeof loginSchema>;
