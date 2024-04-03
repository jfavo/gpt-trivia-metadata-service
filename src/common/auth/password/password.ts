import { hash, compare } from 'bcrypt';

// The number of iterations the hashing algorithm will perform
const WORK_FACTOR = 10;

/**
 * Hashes a plaintext password and returns the hash
 * @param password Plaintext password to hash
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, WORK_FACTOR);
}

/**
 * Compares a plaintext string and a hash
 * @param password Plaintext password to compare
 * @param hash Hashed password to compare to the plaintext
 * @returns {Boolean} If the password and hash match
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await compare(password, hash);
}
