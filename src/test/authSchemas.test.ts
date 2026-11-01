import { describe, it, expect } from 'vitest';
import { loginSchema, twoFactorSchema, resetPasswordSchema } from '../features/auth/schemas/authSchemas';

describe('Auth Validation Schemas', () => {
  it('strictly validates authorized username "Pankaj" and rejects any other username or email', () => {
    const valid = loginSchema.safeParse({
      email: 'Pankaj',
      password: 'PB@TechZone',
      rememberMe: true,
    });
    expect(valid.success).toBe(true);

    const lowercaseValid = loginSchema.safeParse({
      email: 'pankaj',
      password: 'PB@TechZone',
    });
    expect(lowercaseValid.success).toBe(true);

    const rejectedEmail = loginSchema.safeParse({
      email: 'admin@pbtechzone.com',
      password: 'PB@TechZone',
    });
    expect(rejectedEmail.success).toBe(false);

    const invalid = loginSchema.safeParse({
      email: 'anyotheruser',
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

