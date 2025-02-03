import { RepositoryContract } from 'src/shared/repositories/interfaces/repository-contract.interface';
import { IUser } from '../interfaces/user.interface';

export interface UserRepositoryInterface
  extends Omit<RepositoryContract<IUser>, 'findAll'> {
  findByEmail(email: string): Promise<IUser>;
}
