/* eslint-disable @typescript-eslint/no-empty-object-type */
import { RepositoryContract } from 'src/shared/interfaces/repository-contract.interface';
import { Product } from '../entities/product.entity';

export interface ProductRepositoryInterface extends RepositoryContract<Product> {
  increaseStock(id: number, quantity: number): Promise<Product>;
  decreaseStock(id: number, quantity: number): Promise<Product>;
}
