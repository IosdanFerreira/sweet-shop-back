import { PrismaService } from 'src/prisma/prisma.service';
import { CashFlowRepositoryInterface } from '../interfaces/cash-flow-repository.interface';

export class CashFlowRepository implements CashFlowRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(conditionalFilters: any): Promise<any> {
    return this.prisma.$transaction(async (prisma) => {
      // Buscar vendas dentro do período
      const sales = await prisma.sale.findMany({
        where: conditionalFilters,
      });

      //   Calcula o total de vendas
      const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

      // Buscar movimentações de estoque (despesas)
      const stockMovements = await prisma.stockMovement.findMany({
        where: {
          ...conditionalFilters,
          type: 'increase',
        },
        include: {
          product: true,
        },
      });

      // Calcular as despesas totais
      const totalExpenses = stockMovements.reduce(
        (sum, movement) => sum + movement.quantity * movement.product.purchase_price,
        0,
      );

      // Calcular o fluxo de caixa
      const cashFlow = totalRevenue - totalExpenses;

      return {
        total_revenue: totalRevenue,
        total_expenses: totalExpenses,
        cash_flow: cashFlow,
      };
    });
  }
}
