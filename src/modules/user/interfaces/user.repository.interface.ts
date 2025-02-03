import { RepositoryContract } from 'src/shared/interfaces/repository-contract.interface';
import { User } from '../entities/user.entity';

export interface UserRepositoryInterface
  extends Omit<RepositoryContract<User>, 'findAll'> {
  findByEmail(email: string): Promise<User>;
}
