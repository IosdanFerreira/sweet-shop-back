/* eslint-disable @typescript-eslint/no-empty-object-type */
import { RepositoryContract } from 'src/shared/interfaces/repository-contract.interface';
import { Supplier } from '../entities/supplier.entity';

export interface SupplierRepositoryInterface
  extends RepositoryContract<Supplier> {}
