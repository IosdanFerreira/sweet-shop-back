import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockMovementsRepositoryInterface } from './interfaces/stock-movements-repository.interface';
import { ProductsService } from '../products/products.service';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { StockMovementEntity } from './entities/stock-movement.entity';

@Injectable()
export class StockMovementsService {
  constructor(
    private readonly productsService: ProductsService,

    @Inject('StockMovementsRepositoryInterface')
    private readonly stockMovementsRepository: StockMovementsRepositoryInterface,

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
  ): Promise<IDefaultResponse<StockMovementEntity[]>> {
    const totalItems = await this.stockMovementsRepository.countAll();

    const stockMovements = await this.stockMovementsRepository.getMovements(page, limit, orderBy);

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
}
