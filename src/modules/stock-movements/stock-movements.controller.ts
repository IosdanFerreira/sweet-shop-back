import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post('increase')
  createStockEntryIncrease(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.registerStockEntry(createStockMovementDto);
  }

  @Post('decrease')
  createStockEntryDecrease(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.registerStockExit(createStockMovementDto);
  }

  @Get()
  GetAllStockMovements(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order_by') orderBy: 'asc' | 'desc' = 'desc',
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('exact_date') exactDate?: string,
    @Query('product_name') productName?: string,
  ) {
    return this.stockMovementsService.findAllStockMovements(
      page,
      limit,
      orderBy,
      startDate,
      endDate,
      exactDate,
      productName,
    );
  }
}
