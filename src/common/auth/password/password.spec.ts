import { hashPassword } from './password';
import { expect, describe, it } from '@jest/globals';

describe('hashPassword', () => {
  it('should hash the password', async () => {
    const password = 'test';
    const hash = await hashPassword(password);

    expect(hash).not.toEqual(password);
  });
});

// describe('comparePassword', () => {});
