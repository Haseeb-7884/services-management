import { z } from "zod";

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Enter your email or username"),
  password: z.string().min(1, "Enter your password"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(30, "30 characters max")
    .regex(/^[a-zA-Z0-9_.]+$/, "Letters, numbers, _ and . only"),
  displayName: z.string().max(60, "60 characters max").optional().or(z.literal("")),
  email: z.string().min(1, "Enter your email").email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;
