import { z } from 'zod';

export const createContractorSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  nip: z.string().optional(),
});

export type CreateContractorDto = z.infer<typeof createContractorSchema>;
