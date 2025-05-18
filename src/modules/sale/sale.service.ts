import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SalesRepositoryInterface } from './interfaces/sales-repository.interface';
import { CreateSaleDto } from './dto/create-sale.dto';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { SaleEntity } from './entities/sale.entity';
import { FormatDateInUsaInterface } from 'src/shared/interfaces/format-date-in-usa.interface';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { Prisma } from '@prisma/client';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';

@Injectable()
export class SaleService {
  constructor(
    @Inject('SalesRepositoryInterface')
    private readonly saleRepository: SalesRepositoryInterface,

    @Inject('FormatDateInUsaInterface')
    private readonly formatDateInUsa: FormatDateInUsaInterface,

    @Inject('RemoveAccentsInterface')
    private readonly removeAccents: RemoveAccentsInterface,

    @Inject('PaginationInterface')
    private readonly pagination: PaginationInterface,
  ) {}

  /**
   * Registers a new sale in the database.
   * @param items The items to be included in the sale.
   * @returns A promise with the formatted response indicating success.
   */
  async registerSale(items: CreateSaleDto[]): Promise<IDefaultResponse<SaleEntity>> {
    if (items.length === 0) {
      throw new Error('A venda deve conter pelo menos um item.');
    }

    const newSale = await this.saleRepository.register(items);

    const formattedReturn: IDefaultResponse<SaleEntity> = {
      status_code: HttpStatus.CREATED,
      success: true,
      error_type: null,
      errors: null,
      message: 'Vendas realizada com sucesso',
      data: newSale,
      pagination: null,
    };

    return formattedReturn;
  }

  /**
   * Finds all sales, using the given filters.
   * @param page The page of the pagination.
   * @param limit The limit of items per page.
   * @param orderBy The order of the items, either 'asc' or 'desc'.
   * @param startDate The start date of the filter, in ISO 8601 format.
   * @param endDate The end date of the filter, in ISO 8601 format.
   * @param exactDate The exact date of the filter, in ISO 8601 format.
   * @param productName The name of the product to filter, case insensitive.
   * @returns A promise with the list of sales and a default response.
   */
  async getAllSales(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    startDate?: string,
    endDate?: string,
    exactDate?: string,
    productName?: string,
  ): Promise<IDefaultResponse<SaleEntity[]>> {
    // Build the conditional filters from the given parameters
    const conditionalFilters = this.buildConditionalFilters(startDate, endDate, exactDate, productName);

    // Count the total of items, using the filters
    const countAllSales = await this.saleRepository.countAll(
      this.buildConditionalFilters(startDate, endDate, exactDate, productName),
    );

    // Find the sales, using the filters and pagination
    const allSales = await this.saleRepository.findAll(page, limit, orderBy, conditionalFilters);

    // Format the return
    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Vendas encontradas com sucesso',
      data: allSales,
      pagination: this.pagination.generate(countAllSales, page, limit),
    };

    // Return the formatted response
    return formattedReturn;
  }

  /**
   * Builds a conditional filter to use in the sales repository.
   * This function receives four parameters and uses them to build a filter
   * that will be used to find sales.
   * @param startDate The start date of the filter, in ISO 8601 format.
   * @param endDate The end date of the filter, in ISO 8601 format.
   * @param exactDate The exact date of the filter, in ISO 8601 format.
   * @param productName The name of the product to filter, case insensitive.
   * @returns A conditional filter to use in the sales repository.
   */
  private buildConditionalFilters(
    startDate?: string,
    endDate?: string,
    exactDate?: string,
    productName?: string,
  ): Prisma.SaleWhereInput {
    const conditionalFilter: Prisma.SaleWhereInput = {};

    // Filter by date
    if (exactDate) {
      // Format the date in the US format, to be used in the filter
      const formattedDate = this.formatDateInUsa.execute(exactDate);

      // Create a filter to find sales that were created in the given date
      conditionalFilter.created_at = {
        gte: new Date(`${formattedDate}T00:00:00.000Z`),
        lte: new Date(`${formattedDate}T23:59:59.999Z`),
      };
    }

    if (startDate) {
      // Format the start date in the US format, to be used in the filter
      const formattedStart = this.formatDateInUsa.execute(startDate);

      // Add the start date to the filter
      conditionalFilter.created_at = {
        ...(conditionalFilter.created_at as Prisma.DateTimeFilter),
        gte: new Date(`${formattedStart}T00:00:00.000Z`),
      };
    }

    if (endDate) {
      // Format the end date in the US format, to be used in the filter
      const formattedEnd = this.formatDateInUsa.execute(endDate);

      // Add the end date to the filter
      conditionalFilter.created_at = {
        ...(conditionalFilter.created_at as Prisma.DateTimeFilter),
        lte: new Date(`${formattedEnd}T23:59:59.999Z`),
      };
    }

    // Filter by product name
    if (productName) {
      // Create a filter to find sales that have a product with the given name
      conditionalFilter.items = {
        some: {
          product: {
            OR: [
              // Case insensitive search
              { name: { contains: productName, mode: 'insensitive' } },
              // Case insensitive search, using the remove accents utility
              { name_unaccented: { contains: this.removeAccents.execute(productName), mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    return conditionalFilter;
  }
}
