import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SalesRepositoryInterface } from './interfaces/sales-repository.interface';
import { CreateSaleDto } from './dto/create-sale.dto';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { SaleEntity } from './entities/sale.entity';
import { FormatDateInUsaInterface } from 'src/shared/interfaces/format-date-in-usa.interface';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { Prisma } from '@prisma/client';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';

@Injectable()
export class SaleService {
  constructor(
    @Inject('SalesRepositoryInterface')
    private readonly saleRepository: SalesRepositoryInterface,

    @Inject('FormatDateInUsaInterface')
    private readonly formatDateInUsa: FormatDateInUsaInterface,

    @Inject('RemoveAccentsInterface')
    private readonly removeAccents: RemoveAccentsInterface,

    @Inject('PaginationInterface')
    private readonly pagination: PaginationInterface,
  ) {}

  async registerSale(items: CreateSaleDto[]): Promise<IDefaultResponse<SaleEntity>> {
    if (items.length === 0) {
      throw new Error('A venda deve conter pelo menos um item.');
    }

    const newSale = await this.saleRepository.register(items);

    const formattedReturn = {
      status_code: HttpStatus.CREATED,
      success: true,
      error_type: null,
      errors: null,
      message: 'Vendas realizada com sucesso',
      data: newSale,
      pagination: null,
    };

    return formattedReturn;
  }

  async getAllSales(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    startDate?: string,
    endDate?: string,
    exactDate?: string,
    productName?: string,
  ): Promise<IDefaultResponse<SaleEntity[]>> {
    const conditionalFilters = this.buildConditionalFilters(startDate, endDate, exactDate, productName);

    const countAllSales = await this.saleRepository.countAll(
      this.buildConditionalFilters(startDate, endDate, exactDate, productName),
    );
    const allSales = await this.saleRepository.findAll(page, limit, orderBy, conditionalFilters);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Vendas encontradas com sucesso',
      data: allSales,
      pagination: this.pagination.generate(countAllSales, page, limit),
    };

    return formattedReturn;
  }

  private buildConditionalFilters(
    startDate?: string,
    endDate?: string,
    exactDate?: string,
    productName?: string,
  ): Prisma.SaleWhereInput {
    const conditionalFilter: Prisma.SaleWhereInput = {};

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
      conditionalFilter.items = {
        some: {
          product: {
            OR: [
              { name: { contains: productName, mode: 'insensitive' } },
              { name_unaccented: { contains: this.removeAccents.execute(productName), mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    return conditionalFilter;
  }
}
