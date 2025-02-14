import { PrismaService } from 'src/prisma/prisma.service';
import { ReportRepositoryInterface } from '../interfaces/report-repository.interface';
import { Prisma } from '@prisma/client';

export class ReportRepository implements ReportRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  async findSellingTopProducts(): Promise<
    (Prisma.PickEnumerable<Prisma.SaleItemGroupByOutputType, 'product_id'[]> & {
      _sum: {
        quantity: number;
      };
    })[]
  > {
    const topProducts = await this.prisma.saleItem.groupBy({
      by: ['product_id'],
      _sum: {
        quantity: true,
      },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    return topProducts;
  }

  async findCheapestSuppliers(): Promise<
    (Prisma.PickEnumerable<Prisma.ProductGroupByOutputType, 'supplier_id'[]> & {
      _avg: { purchase_price: number };
    })[]
  > {
    const suppliers = await this.prisma.product.groupBy({
      by: ['supplier_id'],
      _avg: { purchase_price: true },
      orderBy: { _avg: { purchase_price: 'asc' } },
      take: 5,
    });

    return suppliers;
  }

  async findGroupSales() {
    const salesByMonth = await this.prisma.sale.groupBy({
      by: ['created_at'],
      _count: {
        id: true, // Conta o número total de vendas
      },
      orderBy: { created_at: 'desc' },
    });

    return salesByMonth;
  }
}
