import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CashFlowRepositoryInterface } from '../interfaces/cash-flow-repository.interface';

export class CashFlowRepository implements CashFlowRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds all sales and calculates the cash flow.
   * @param conditionalFilters The filters to apply to the sales and stock movements queries.
   * @returns A promise resolving to an object containing total revenue, total expenses, and cash flow.
   */
  async findAll(conditionalFilters: any): Promise<any> {
    return this.prisma.$transaction(async (prisma) => {
      // Find all sales that match the given filters
      const sales = await prisma.sale.findMany({
        where: conditionalFilters,
      });

      // Calculate the total revenue from sales
      const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

      // Find all stock movements with type 'increase' and matching filters
      const stockMovements = await prisma.stockMovement.findMany({
        where: {
          ...conditionalFilters,
          type: 'increase',
        },
        include: {
          product: true,
        },
      });

      // Calculate the total expenses from stock movements
      const totalExpenses = stockMovements.reduce(
        (sum, movement) => sum + movement.quantity * movement.product.purchase_price,
        0,
      );

      // Calculate the cash flow by subtracting total expenses from total revenue
      const cashFlow = totalRevenue - totalExpenses;

      // Return an object containing total revenue, total expenses, and cash flow
      return {
        total_revenue: totalRevenue,
        total_expenses: totalExpenses,
        cash_flow: cashFlow,
      };
    });
  }
}
