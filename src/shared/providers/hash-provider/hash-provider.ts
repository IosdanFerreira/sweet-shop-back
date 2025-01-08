import { compare, hash } from 'bcrypt';
import { HashProviderInterface } from './hash-provider.interface';

export class HashProvider implements HashProviderInterface {
  generateHash(payload: string): Promise<string> {
    return hash(payload, 10);
  }

  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
