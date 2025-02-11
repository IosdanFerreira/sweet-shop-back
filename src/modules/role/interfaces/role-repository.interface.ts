/* eslint-disable @typescript-eslint/no-empty-object-type */
import { RepositoryContract } from 'src/shared/interfaces/repository-contract.interface';
import { RoleEntity } from '../entities/role.entity';

export interface RoleRepositoryInterface
  extends Omit<RepositoryContract<RoleEntity>, 'countAll' | 'countAllFiltered' | 'findAllFiltered'> {}
