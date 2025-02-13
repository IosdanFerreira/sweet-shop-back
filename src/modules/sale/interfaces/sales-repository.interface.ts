import { Prisma } from '@prisma/client';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleEntity } from '../entities/sale.entity';

export interface SalesRepositoryInterface {
  register(CreateSaleDto: CreateSaleDto[]): Promise<SaleEntity>;
  findAll(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc',
    conditionalFilters?: Prisma.SaleWhereInput,
  ): Promise<SaleEntity[]>;
  countAll(conditionalFilters?: Prisma.SaleWhereInput): Promise<number>;
}
