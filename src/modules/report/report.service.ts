import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ReportRepositoryInterface } from './interfaces/report-repository.interface';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReportService {
  constructor(
    @Inject('ReportRepositoryInterface')
    private readonly reportRepository: ReportRepositoryInterface,

    private readonly productsService: ProductsService,
  ) {}

  async getSalesReport() {
    const salesByMonth = await this.reportRepository.findGroupSales();

    const groupedSales = salesByMonth.reduce(
      (acc, sale) => {
        const month = sale.created_at.toISOString().slice(5, 7) + '/' + sale.created_at.getFullYear();

        if (!acc[month]) {
          acc[month] = 0;
        }

        acc[month] += sale._count.id;

        return acc;
      },
      {} as Record<string, number>,
    );

    // Converter objeto para array
    const formattedSalesReport = Object.entries(groupedSales).map(([month, total_sales]) => ({
      month,
      total_sales,
    }));

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Relatório de vendas encontrado com sucesso',
      data: formattedSalesReport,
      pagination: null,
    };

    return formattedReturn;
  }

  async getSellingTopProducts() {
    const topProducts = await this.reportRepository.findSellingTopProducts();

    const formattedTopProducts = [];

    await Promise.all(
      topProducts.map(async (item) => {
        const product = await this.productsService.findProductById(item.product_id);

        formattedTopProducts.push({ product: product.data, quantity_sold: item._sum.quantity });
      }),
    );

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Produtos mais vendidos encontrado com sucesso',
      data: formattedTopProducts,
      pagination: null,
    };

    return formattedReturn;
  }
}
