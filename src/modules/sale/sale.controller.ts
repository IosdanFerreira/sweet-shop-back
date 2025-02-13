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
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('exact_date') exactDate?: string,
    @Query('product_name') productName?: string,
  ) {
    return this.saleService.getAllSales(page, limit, orderBy, startDate, endDate, exactDate, productName);
  }
}
