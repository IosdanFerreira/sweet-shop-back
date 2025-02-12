import { ProductEntity } from 'src/modules/products/entities/product.entity';

export class SaleItemEntity {
  quantity: number;
  unit_price: number;
  subtotal: number;
  product: ProductEntity;
}
