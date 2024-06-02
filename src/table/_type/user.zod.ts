import * as z from 'zod';

const zRoleSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  edges: z.object({}).optional(),
});

const zUserSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  first_name: z.string(),
  email: z.string(),
  last_name: z.string(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
  onboard_status: z.string(),
  tfa_code: z.string(),
  tfa_code_expiry: z.string(),
  last_password_change: z.string(),
  last_password_reset: z.string(),
  edges: z.object({
    roles: z.array(zRoleSchema),
  }),
});

const zUserResType = z.object({
  users: z.array(zUserSchema),
  total: z.number(),
});

export type UserResType = z.infer<typeof zUserResType>;
export type UserType = z.infer<typeof zUserSchema>;
