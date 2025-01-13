import { RepositoryContract } from 'src/shared/repositories/interfaces/repository-contract.interface';
import { UserOutput } from '../interfaces/user-output.interface';
import { User } from '../entities/user.entity';

export interface UserRepositoryInterface
  extends Omit<RepositoryContract<UserOutput>, 'findAll'> {
  findByEmail(email: string): Promise<User>;
}
