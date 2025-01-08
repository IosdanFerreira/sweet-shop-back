import { RepositoryContract } from 'src/shared/repositories/interfaces/repository-contract.interface';
import { UserOutput } from '../dto/user-output.dto';

export interface UserRepositoryInterface
  extends Omit<RepositoryContract<UserOutput>, 'findAll'> {
  findByEmail(email: string): Promise<UserOutput>;
}
