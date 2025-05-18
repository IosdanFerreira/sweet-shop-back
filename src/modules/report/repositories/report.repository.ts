import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ReportRepositoryInterface } from '../interfaces/report-repository.interface';
import { Prisma } from '@prisma/client';

export class ReportRepository implements ReportRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find the top selling products and the quantity sold
   * @returns The top 10 selling products with the quantity sold
   */
  async findSellingTopProducts(): Promise<
    (Prisma.PickEnumerable<Prisma.SaleItemGroupByOutputType, 'product_id'[]> & {
      _sum: {
        quantity: number;
      };
    })[]
  > {
    // Group sale items by product_id and calculate the sum of quantities sold
    const topProducts = await this.prisma.saleItem.groupBy({
      by: ['product_id'], // Group by product ID
      _sum: {
        quantity: true, // Sum the quantity for each product
      },
      orderBy: { _sum: { quantity: 'desc' } }, // Order by descending quantity
      take: 10, // Limit the result to top 10 products
    });

    // Return the top selling products with their quantities
    return topProducts;
  }

  /**
   * Find the cheapest suppliers and the average purchase price.
   * This method returns the top 5 suppliers with the lowest average purchase price.
   * @returns The 5 cheapest suppliers with the average purchase price
   */
  async findCheapestSuppliers(): Promise<
    (Prisma.PickEnumerable<Prisma.ProductGroupByOutputType, 'supplier_id'[]> & {
      _avg: { purchase_price: number };
    })[]
  > {
    // Group products by supplier_id
    // Calculate the average purchase_price for each supplier
    // Order the result by the average purchase_price in ascending order
    // Limit the result to the top 5 suppliers
    const suppliers = await this.prisma.product.groupBy({
      by: ['supplier_id'], // Group by supplier_id
      _avg: { purchase_price: true }, // Calculate the average purchase_price
      orderBy: { _avg: { purchase_price: 'asc' } }, // Order by ascending average purchase_price
      take: 5, // Limit the result to the top 5 suppliers
    });

    return suppliers;
  }

  /**
   * Finds the sales grouped by month.
   * This method returns the sales grouped by month in descending order.
   * @returns The sales grouped by month
   */
  async findGroupSales(): Promise<
    (Prisma.PickEnumerable<Prisma.SaleGroupByOutputType, 'created_at'[]> & {
      _count: {
        id: number; // Counts the total number of sales
      };
    })[]
  > {
    // Group sales by month
    // Count the total number of sales for each month
    // Order the result by month in descending order
    const salesByMonth = await this.prisma.sale.groupBy({
      by: ['created_at'], // Group by month
      _count: {
        id: true, // Counts the total number of sales
      },
      orderBy: { created_at: 'desc' }, // Order by month in descending order
    });

    return salesByMonth;
  }
}
