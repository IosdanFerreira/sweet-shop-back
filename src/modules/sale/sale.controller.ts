import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { SaleService } from './sale.service';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  registerSale(@Body() body: { items: { product_id: number; quantity: number }[] }) {
    return this.saleService.registerSale(body.items);
  }

  @Get()
  GetAllSales(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order_by') orderBy: 'asc' | 'desc' = 'desc',
    @Query('search') search?: string,
  ) {
    return this.saleService.getAllSales(page, limit, orderBy, search);
  }
}
