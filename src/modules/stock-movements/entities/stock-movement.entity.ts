import { $Enums } from '@prisma/client';
import { ProductEntity } from 'src/modules/products/entities/product.entity';

export class StockMovementEntity {
  id: number;
  type: $Enums.StockType;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  product: ProductEntity;
}
