import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, _ and ."),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // Accept "" (an untouched optional form field, not just an omitted key) as
  // equivalent to "not provided" - this was previously min(1)-required
  // whenever the key was present at all, which rejected every signup that
  // left the display name blank with a generic "Validation failed".
  displayName: z
    .string()
    .max(60)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.trim() : undefined)),
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});
