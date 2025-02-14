import { Prisma } from '@prisma/client';

export interface ReportRepositoryInterface {
  findGroupSales(): Promise<
    (Prisma.PickEnumerable<Prisma.SaleGroupByOutputType, 'created_at'[]> & {
      _count: {
        id: number;
      };
    })[]
  >;
  findSellingTopProducts(): Promise<
    (Prisma.PickEnumerable<Prisma.SaleItemGroupByOutputType, 'product_id'[]> & {
      _sum: {
        quantity: number;
      };
    })[]
  >;
}
