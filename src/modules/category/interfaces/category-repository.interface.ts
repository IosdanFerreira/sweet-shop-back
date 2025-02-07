/* eslint-disable @typescript-eslint/no-empty-object-type */
import { RepositoryContract } from 'src/shared/interfaces/repository-contract.interface';
import { Category } from '../entities/category.entity';

export interface CategoryRepositoryInterface
  extends RepositoryContract<Category> {}
