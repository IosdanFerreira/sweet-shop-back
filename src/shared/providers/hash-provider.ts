import { compare, hash } from 'bcryptjs';

import { HashProviderInterface } from '../interfaces/hash-provider.interface';

export class HashProvider implements HashProviderInterface {
  /**
   * Generate a hash for a given payload.
   *
   * @param {string} payload
   * @returns {Promise<string>}
   */
  async generateHash(payload: string): Promise<string> {
    /**
     * The cost factor controls how much time it takes to generate a hash.
     * A higher cost factor is more secure, but it is also slower.
     * The default cost factor is 10.
     */
    const costFactor = 10;

    return hash(payload, costFactor);
  }

  /**
   * Compare a given payload to a hashed payload.
   *
   * @param {string} payload
   * @param {string} hashed
   * @returns {Promise<boolean>}
   */
  async compareHash(payload: string, hashed: string): Promise<boolean> {
    /**
     * Compare a given payload to a hashed payload.
     * This method uses the compare() method of bcryptjs to compare the two payloads.
     * If the payloads match, the method returns true, otherwise it returns false.
     */
    return compare(payload, hashed);
  }
}
