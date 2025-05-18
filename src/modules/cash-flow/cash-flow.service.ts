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

  /**
   * Retrieves the cash flow for a specified date range.
   * @param startDate The start date of the desired cash flow period.
   * @param endDate The end date of the desired cash flow period.
   * @returns A promise with the cash flow data and a formatted response.
   */
  async getCashFlow(startDate: string, endDate: string) {
    // Build the conditional filters from the given start and end dates
    const conditionalFilter = this.buildConditionalFilters(startDate, endDate);

    // Retrieve cash flow data from the repository using the conditional filters
    const cashFlow = await this.cashFlowRepository.findAll(conditionalFilter);

    // Format the return response
    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Fluxo de caixa encontrado com sucesso',
      data: cashFlow,
      pagination: null,
    };

    // Return the formatted response
    return formattedReturn;
  }

  /**
   * Builds a conditional filter from the given start and end dates.
   * @param startDate The start date of the desired cash flow period.
   * @param endDate The end date of the desired cash flow period.
   * @returns A conditional filter to use in the cash flow repository.
   */
  private buildConditionalFilters(startDate: string, endDate: string): Prisma.SaleWhereInput {
    // Initialize an empty object to store the conditional filters
    const conditionalFilter: any = {};

    // If a start date is provided, add it to the conditional filters
    if (startDate) {
      // Format the start date in the US format, to be used in the filter
      const formattedStart = this.formatDateInUsa.execute(startDate);

      // Add the start date to the filter
      conditionalFilter.created_at = {
        ...(conditionalFilter.created_at as Prisma.DateTimeFilter),
        // The start date of the filter must be greater than or equal to the given date
        gte: new Date(`${formattedStart}T00:00:00.000Z`),
      };
    }

    // If an end date is provided, add it to the conditional filters
    if (endDate) {
      // Format the end date in the US format, to be used in the filter
      const formattedEnd = this.formatDateInUsa.execute(endDate);

      // Add the end date to the filter
      conditionalFilter.created_at = {
        ...(conditionalFilter.created_at as Prisma.DateTimeFilter),
        // The end date of the filter must be less than or equal to the given date
        lte: new Date(`${formattedEnd}T23:59:59.999Z`),
      };
    }

    // Return the formatted conditional filters
    return conditionalFilter;
  }
}
