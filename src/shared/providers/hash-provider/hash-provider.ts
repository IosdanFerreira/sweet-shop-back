import { compare, hash } from 'bcrypt';
import { IHashProvider } from './hash-provider.interface';

export class HashProvider implements IHashProvider {
  generateHash(payload: string): Promise<string> {
    return hash(payload, 10);
  }
  compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
