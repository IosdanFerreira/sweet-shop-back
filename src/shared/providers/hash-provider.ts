import { compare, hash } from 'bcryptjs';

import { HashProviderInterface } from '../interfaces/hash-provider.interface';

export class HashProvider implements HashProviderInterface {
  /**
   * Gera um hash de uma string fornecida
   * @param payload A string a ser criptografada
   * @returns Um hash gerado com a string fornecida
   */
  generateHash(payload: string): Promise<string> {
    return hash(payload, 10);
  }

  /**
   * Compara uma string com o hash correspondente
   * @param payload A string a ser comparada com o hash
   * @param hashed O hash a ser comparado com a string
   * @returns Um boolean indicando se a string e o hash correspondem
   */
  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
