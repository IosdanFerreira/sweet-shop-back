/* eslint-disable @typescript-eslint/no-empty-object-type */
import { RepositoryContract } from 'src/shared/interfaces/repository-contract.interface';
import { CategoryEntity } from '../entities/category.entity';

export interface CategoryRepositoryInterface extends RepositoryContract<CategoryEntity> {}
