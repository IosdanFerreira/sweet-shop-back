import { RepositoryContract } from 'src/shared/repositories/interfaces/repository-contract.interface';
import { IUser } from '../interfaces/user.interface';
import { User } from '@prisma/client';

export interface UserRepositoryInterface
  extends Omit<RepositoryContract<IUser>, 'findAll'> {
  findByEmail(email: string): Promise<User>;
}
