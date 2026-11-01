import { describe, it, expect } from 'vitest';
import { loginSchema, twoFactorSchema, resetPasswordSchema } from '../features/auth/schemas/authSchemas';

describe('Auth Validation Schemas', () => {
  it('validates correct email and password length', () => {
    const valid = loginSchema.safeParse({
      email: 'admin@pbtechzone.com',
      password: 'StrongPassword123!',
      rememberMe: true,
    });
    expect(valid.success).toBe(true);
  });

  it('rejects invalid email formats', () => {
    const invalid = loginSchema.safeParse({
      email: 'invalid-email-address',
      password: 'password123',
    });
    expect(invalid.success).toBe(false);
  });

  it('validates 6-digit TOTP codes strictly', () => {
    expect(twoFactorSchema.safeParse({ code: '849102' }).success).toBe(true);
    expect(twoFactorSchema.safeParse({ code: 'abc' }).success).toBe(false);
    expect(twoFactorSchema.safeParse({ code: '12345' }).success).toBe(false);
    expect(twoFactorSchema.safeParse({ code: '1234567' }).success).toBe(false);
  });

  it('requires password match on reset', () => {
    const matching = resetPasswordSchema.safeParse({
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    expect(matching.success).toBe(true);

    const mismatch = resetPasswordSchema.safeParse({
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!',
    });
    expect(mismatch.success).toBe(false);
  });
});

