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

  async registerStockEntry(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<IDefaultResponse<StockMovementEntity>> {
    await this.productsService.findProductById(createStockMovementDto.product_id);

    const stockMovement = await this.stockMovementsRepository.registerEntry(createStockMovementDto);

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

  async registerStockExit(
    createStockMovementDto: CreateStockMovementDto,
  ): Promise<IDefaultResponse<StockMovementEntity>> {
    await this.productsService.findProductById(createStockMovementDto.product_id);

    const stockMovement = await this.stockMovementsRepository.registerExit(createStockMovementDto);

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

  async findAllStockMovements(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    startDate?: string,
    endDate?: string,
    exactDate?: string,
    productName?: string,
  ): Promise<IDefaultResponse<StockMovementEntity[]>> {
    const conditionalFilters = this.buildConditionalFilters(startDate, endDate, exactDate, productName);

    const totalItems = await this.stockMovementsRepository.countAll(conditionalFilters);

    const stockMovements = await this.stockMovementsRepository.getMovements(page, limit, orderBy, conditionalFilters);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Movimentações de estoque encontradas com sucesso',
      data: stockMovements,
      pagination: this.pagination.generate(totalItems, page, limit),
    };

    return formattedReturn;
  }

  private buildConditionalFilters(
    startDate?: string,
    endDate?: string,
    exactDate?: string,
    productName?: string,
  ): Prisma.StockMovementWhereInput {
    const conditionalFilter: Prisma.StockMovementWhereInput = {};

    // Filtro de datas
    if (exactDate) {
      const formattedDate = this.formatDateInUsa.execute(exactDate);

      conditionalFilter.created_at = {
        gte: new Date(`${formattedDate}T00:00:00.000Z`),
        lte: new Date(`${formattedDate}T23:59:59.999Z`),
      };
    }

    if (startDate) {
      const formattedStart = this.formatDateInUsa.execute(startDate);
      conditionalFilter.created_at = {
        ...(conditionalFilter.created_at as Prisma.DateTimeFilter),
        gte: new Date(`${formattedStart}T00:00:00.000Z`),
      };
    }

    if (endDate) {
      const formattedEnd = this.formatDateInUsa.execute(endDate);
      conditionalFilter.created_at = {
        ...(conditionalFilter.created_at as Prisma.DateTimeFilter),
        lte: new Date(`${formattedEnd}T23:59:59.999Z`),
      };
    }

    // 🔍 Filtro por nome do produto
    if (productName) {
      conditionalFilter.product = {
        OR: [
          { name: { contains: productName, mode: 'insensitive' } },
          { name_unaccented: { contains: this.removeAccents.execute(productName), mode: 'insensitive' } },
        ],
      };
    }

    return conditionalFilter;
  }
}
