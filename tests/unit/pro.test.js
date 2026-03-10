import { describe, it, expect } from 'vitest';
import { isPro } from '@/lib/pro';

describe('isPro', () => {
  it('returns false for null session', () => {
    expect(isPro(null)).toBe(false);
  });

  it('returns false for session with no user', () => {
    expect(isPro({})).toBe(false);
  });

  it('returns false for session with user but no email', () => {
    expect(isPro({ user: {} })).toBe(false);
  });

  it('returns true for the owner email', () => {
    expect(isPro({ user: { email: 'dshirtsla@gmail.com' } })).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isPro({ user: { email: 'DSHIRTSLA@GMAIL.COM' } })).toBe(true);
  });

  it('returns false for a non-Pro email', () => {
    expect(isPro({ user: { email: 'other@gmail.com' } })).toBe(false);
  });
});
