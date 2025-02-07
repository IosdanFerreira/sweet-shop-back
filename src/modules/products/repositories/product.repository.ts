import { ProductRepositoryInterface } from '../interfaces/product-repository.interface';
import { Product } from '../entities/product.entity';

export class ProductRepository implements ProductRepositoryInterface {
  countAll(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  findAllFiltered(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc',
    search: string,
  ): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
  countAllFiltered(search: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
  insert(createDto: any): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  findAll(page: number, limit: number, orderBy: string): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
  findById(id: number): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  update(id: number, updateDto: any): Promise<Product> {
    throw new Error('Method not implemented.');
  }
  remove(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
