import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SalesRepositoryInterface } from './interfaces/sales-repository.interface';
import { CreateSaleDto } from './dto/create-sale.dto';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { SaleEntity } from './entities/sale.entity';

@Injectable()
export class SaleService {
  constructor(
    @Inject('SalesRepositoryInterface')
    private readonly saleRepository: SalesRepositoryInterface,
  ) {}
  async registerSale(items: CreateSaleDto[]) {
    if (items.length === 0) {
      throw new Error('A venda deve conter pelo menos um item.');
    }

    const newSale = await this.saleRepository.registerSale(items);

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
    search?: string,
  ): Promise<IDefaultResponse<SaleEntity[]>> {
    const allSales = await this.saleRepository.getAllSales(page, limit, orderBy);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Vendas encontradas com sucesso',
      data: allSales,
      pagination: null,
    };

    return formattedReturn;
  }
}
