/* eslint-disable @typescript-eslint/no-empty-object-type */
import { RepositoryContract } from 'src/shared/interfaces/repository-contract.interface';
import { Role } from '../entities/role.entity';

export interface RoleRepositoryInterface extends RepositoryContract<Role> {
  findAll(): Promise<Role[]>;
}
