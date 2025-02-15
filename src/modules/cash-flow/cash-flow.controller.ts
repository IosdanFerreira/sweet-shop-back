import { Controller, Get, Query } from '@nestjs/common';
import { CashFlowService } from './cash-flow.service';

@Controller('cash-flow')
export class CashFlowController {
  constructor(private readonly cashFlowService: CashFlowService) {}

  @Get()
  getAllCashFlow(@Query('start_date') startDate: string, @Query('end_date') endDate: string) {
    return this.cashFlowService.getCashFlow(startDate, endDate);
  }
}
