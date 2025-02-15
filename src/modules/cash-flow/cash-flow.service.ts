import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CashFlowRepositoryInterface } from './interfaces/cash-flow-repository.interface';
import { Prisma } from '@prisma/client';
import { FormatDateInUsaInterface } from 'src/shared/interfaces/format-date-in-usa.interface';

@Injectable()
export class CashFlowService {
  constructor(
    @Inject('CashFlowRepositoryInterface')
    private readonly cashFlowRepository: CashFlowRepositoryInterface,

    @Inject('FormatDateInUsaInterface')
    private readonly formatDateInUsa: FormatDateInUsaInterface,
  ) {}
  async getCashFlow(startDate: string, endDate: string) {
    const conditionalFilter = this.buildConditionalFilters(startDate, endDate);

    const cashFlow = await this.cashFlowRepository.findAll(conditionalFilter);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Fluxo de caixa encontrado com sucesso',
      data: cashFlow,
      pagination: null,
    };

    return formattedReturn;
  }

  private buildConditionalFilters(startDate: string, endDate: string): Prisma.SaleWhereInput {
    const conditionalFilter: any = {};

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

    return conditionalFilter;
  }
}
