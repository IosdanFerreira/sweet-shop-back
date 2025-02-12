import { SaleItemEntity } from './sale-item.entity';

export class SaleEntity {
  id: number;
  total: number;
  created_at: Date;
  updated_at: Date;
  items: SaleItemEntity[];
}
