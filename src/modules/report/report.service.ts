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

  /**
   * Retrieves a sales report grouped by month and year.
   * @returns A promise with the formatted sales report response.
   */
  async getSalesReport() {
    // Fetch grouped sales data from the repository
    const salesByMonth = await this.reportRepository.findGroupSales();

    // Check if no sales data is found
    if (!salesByMonth || salesByMonth.length === 0) {
      return {
        status_code: HttpStatus.NOT_FOUND,
        success: false,
        error_type: null,
        errors: null,
        message: 'Relatório de vendas não encontrado',
        data: [],
        pagination: null,
      };
    }

    // Accumulate sales count by month/year
    const groupedSales = salesByMonth.reduce(
      (acc, sale) => {
        const month = String(sale.created_at.getUTCMonth() + 1).padStart(2, '0');
        const year = sale.created_at.getUTCFullYear();
        const key = `${month}/${year}`;

        if (!acc[key]) {
          acc[key] = 0;
        }

        acc[key] += sale._count.id;

        return acc;
      },
      {} as Record<string, number>,
    );

    // Convert sales data object to array format
    const formattedSalesReport = Object.entries(groupedSales).map(([month, total_sales]) => ({
      month,
      total_sales,
    }));

    // Construct the response object
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

  /**
   * Finds the top selling products.
   * @returns A promise with the response object
   */
  async getSellingTopProducts() {
    // Find the top selling products
    const topProducts = await this.reportRepository.findSellingTopProducts();

    // Create an array to store the formatted top products
    const formattedTopProducts = [];

    // Iterate over the top selling products
    await Promise.all(
      topProducts.map(async (item) => {
        // Find the product by ID
        const product = await this.productsService.findProductById(item.product_id);

        // Add the product to the formatted list
        formattedTopProducts.push({ product: product.data, quantity_sold: item._sum.quantity });
      }),
    );

    // Construct the response object
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
