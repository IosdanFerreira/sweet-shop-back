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
  ) {
    return this.stockMovementsService.findAllStockMovements(page, limit, orderBy);
  }
}
