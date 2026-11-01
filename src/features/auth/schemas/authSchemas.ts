import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid business email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, 'Authentication code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid registered email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include at least one uppercase letter')
      .regex(/[0-9]/, 'Must include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must include at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid business email address'),
  organizationName: z.string().min(2, 'Company or organization name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms of service' }),
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

