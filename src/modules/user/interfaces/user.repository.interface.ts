import { RepositoryContract } from 'src/shared/interfaces/repository-contract.interface';
import { UserEntity } from '../entities/user.entity';

export interface UserRepositoryInterface
  extends Omit<RepositoryContract<UserEntity>, 'findAll' | 'countAll' | 'findAllFiltered' | 'countAllFiltered'> {
  findByEmail(email: string): Promise<UserEntity>;
}
