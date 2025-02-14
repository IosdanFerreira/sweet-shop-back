import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('sales')
  getSales() {
    return this.reportService.getSalesReport();
  }

  @Get('top-products')
  getProducts() {
    return this.reportService.getSellingTopProducts();
  }
}
