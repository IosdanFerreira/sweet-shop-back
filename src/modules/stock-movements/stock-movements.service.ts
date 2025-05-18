import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockMovementsRepositoryInterface } from './interfaces/stock-movements-repository.interface';
import { ProductsService } from '../products/products.service';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { Prisma } from '@prisma/client';
import { FormatDateInUsaInterface } from 'src/shared/interfaces/format-date-in-usa.interface';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';

@Injectable()
export class StockMovementsService {
  constructor(
    private readonly productsService: ProductsService,

    @Inject('StockMovementsRepositoryInterface')
    private readonly stockMovementsRepository: StockMovementsRepositoryInterface,

    @Inject('FormatDateInUsaInterface')
    private readonly formatDateInUsa: FormatDateInUsaInterface,

    @Inject('RemoveAccentsInterface')
    private readonly removeAccents: RemoveAccentsInterface,

    @Inject('PaginationInterface')
    private readonly pagination: PaginationInterface,
  ) {}

  /**
   * Registers a new stock movement of type 'increase' in the stock.
   * @param createStockMovementDto The data to create the stock movement.
   * @returns A promise with the created stock movement and a default response.
   */
  async registerStockEntry(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<IDefaultResponse<StockMovementEntity>> {
    // Verify if the product exists
    await this.productsService.findProductById(createStockMovementDto.product_id);

    // Register the stock movement
    const stockMovement = await this.stockMovementsRepository.registerEntry(createStockMovementDto);

    // Format the return
    const formattedReturn = {
      status_code: HttpStatus.CREATED,
      success: true,
      error_type: null,
      errors: null,
      message: 'Estoque do produto atualizado com sucesso',
      data: { ...stockMovement },
      pagination: null,
    };

    return formattedReturn;
  }

  /**
   * Registers a new stock movement of type 'decrease' in the stock.
   * @param createStockMovementDto The data to create the stock movement.
   * @returns A promise with the created stock movement and a default response.
   */
  async registerStockExit(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<IDefaultResponse<StockMovementEntity>> {
    // Verify if the product exists
    await this.productsService.findProductById(createStockMovementDto.product_id);

    // Register the stock movement
    const stockMovement = await this.stockMovementsRepository.registerExit(createStockMovementDto);

    // Format the return
    const formattedReturn = {
      status_code: HttpStatus.CREATED,
      success: true,
      error_type: null,
      errors: null,
      message: 'Estoque do produto atualizado com sucesso',
      data: { ...stockMovement },
      pagination: null,
    };

    return formattedReturn;
  }

  /**
   * Finds all stock movements, using the given filters.
   * @param page The page of the pagination.
   * @param limit The limit of items per page.
   * @param orderBy The order of the items, either 'asc' or 'desc'.
   * @param startDate The start date of the filter, in ISO 8601 format.
   * @param endDate The end date of the filter, in ISO 8601 format.
   * @param exactDate The exact date of the filter, in ISO 8601 format.
   * @param productName The name of the product to filter, case insensitive.
   * @returns A promise with the list of stock movements and a default response.
   */
  async findAllStockMovements(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    startDate?: string,
    endDate?: string,
    exactDate?: string,
    productName?: string,
  ): Promise<IDefaultResponse<StockMovementEntity[]>> {
    // Build the conditional filters from the given parameters
    const conditionalFilters = this.buildConditionalFilters(startDate, endDate, exactDate, productName);

    // Count the total of items, using the filters
    const totalItems = await this.stockMovementsRepository.countAll(conditionalFilters);

    // Find the stock movements, using the filters and pagination
    const stockMovements = await this.stockMovementsRepository.getMovements(page, limit, orderBy, conditionalFilters);

    // Format the return
    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Movimentações de estoque encontradas com sucesso',
      data: stockMovements,
      pagination: this.pagination.generate(totalItems, page, limit),
    };

    // Return the formatted response
    return formattedReturn;
  }

  /**
   * Builds a conditional filter to use in the stock movements repository.
   * This function receives four parameters and uses them to build a filter
   * that will be used to find stock movements.
   * @param startDate The start date of the filter, in ISO 8601 format.
   * @param endDate The end date of the filter, in ISO 8601 format.
   * @param exactDate The exact date of the filter, in ISO 8601 format.
   * @param productName The name of the product to filter, case insensitive.
   * @returns A conditional filter to use in the stock movements repository.
   */
  private buildConditionalFilters(
    startDate?: string,
    endDate?: string,
    exactDate?: string,
    productName?: string,
  ): Prisma.StockMovementWhereInput {
    const conditionalFilter: Prisma.StockMovementWhereInput = {};

    // Filtro de datas
    if (exactDate) {
      // Format the date in the US format, to be used in the filter
      const formattedDate = this.formatDateInUsa.execute(exactDate);

      // Create a filter to find stock movements that were created in the given date
      conditionalFilter.created_at = {
        gte: new Date(`${formattedDate}T00:00:00.000Z`), // Start of the day
        lte: new Date(`${formattedDate}T23:59:59.999Z`), // End of the day
      };
    }

    if (startDate) {
      // Format the start date in the US format, to be used in the filter
      const formattedStart = this.formatDateInUsa.execute(startDate);

      // Add the start date to the filter
      conditionalFilter.created_at = {
        ...(conditionalFilter.created_at as Prisma.DateTimeFilter),
        gte: new Date(`${formattedStart}T00:00:00.000Z`), // Start of the day
      };
    }

    if (endDate) {
      // Format the end date in the US format, to be used in the filter
      const formattedEnd = this.formatDateInUsa.execute(endDate);

      // Add the end date to the filter
      conditionalFilter.created_at = {
        ...(conditionalFilter.created_at as Prisma.DateTimeFilter),
        lte: new Date(`${formattedEnd}T23:59:59.999Z`), // End of the day
      };
    }

    if (productName) {
      // Create a filter to find stock movements that have a product with the given name
      conditionalFilter.product = {
        OR: [
          { name: { contains: productName, mode: 'insensitive' } }, // Case insensitive search
          {
            name_unaccented: {
              contains: this.removeAccents.execute(productName),
              mode: 'insensitive',
            },
          }, // Case insensitive search, using the unaccented name
        ],
      };
    }

    return conditionalFilter;
  }
}
