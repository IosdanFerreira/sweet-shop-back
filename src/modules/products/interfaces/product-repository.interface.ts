/* eslint-disable @typescript-eslint/no-empty-object-type */
import { RepositoryContract } from 'src/shared/interfaces/repository-contract.interface';
import { ProductEntity } from '../entities/product.entity';

export interface ProductRepositoryInterface extends RepositoryContract<ProductEntity> {}
