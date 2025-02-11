import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { SupplierEntity } from 'src/modules/supplier/entities/supplier.entity';

export class ProductEntity {
  id: number;
  name: string;
  description: string;
  purchase_price: number;
  selling_price: number;
  stock: number;
  category: CategoryEntity;
  supplier: SupplierEntity;
  created_at: Date;
  updated_at: Date;
}
