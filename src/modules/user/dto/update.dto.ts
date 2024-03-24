import { z } from 'zod';
export const updateSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
});

export type UpdateUserDto = z.infer<typeof updateSchema>;
