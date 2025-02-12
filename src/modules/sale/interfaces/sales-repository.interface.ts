import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleEntity } from '../entities/sale.entity';

export interface SalesRepositoryInterface {
  registerSale(CreateSaleDto: CreateSaleDto[]): Promise<SaleEntity>;
  getAllSales(page: number, limit: number, orderBy: 'asc' | 'desc'): Promise<SaleEntity[]>;
}
