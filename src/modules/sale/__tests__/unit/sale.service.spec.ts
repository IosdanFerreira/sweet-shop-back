import { Test, TestingModule } from '@nestjs/testing';

import { APP_PIPE } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CreateSaleDto } from '../../dto/create-sale.dto';
import { HttpStatus } from '@nestjs/common';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RemoveAccents } from 'src/shared/utils/remove-accents';
import { SaleDataBuilder } from '../testing/sale-data-builder';
import { SaleEntity } from '../../entities/sale.entity';
import { SaleService } from '../../sale.service';
import { SalesRepository } from '../../repositories/sales.repository';
import { SalesRepositoryInterface } from '../../interfaces/sales-repository.interface';
import { SharedModule } from 'src/shared/modules/shared-module.module';

describe('SaleService', () => {
  let saleService: SaleService;
  let saleRepository: SalesRepositoryInterface;
  let pagination: PaginationInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        SaleService,
        PrismaService,
        {
          provide: APP_PIPE,
          useValue: { transform: jest.fn() },
        },
        {
          provide: 'SalesRepositoryInterface',
          useClass: SalesRepository,
        },
        {
          provide: 'RemoveAccentsInterface',
          useClass: RemoveAccents,
        },
        {
          provide: 'PaginationInterface',
          useValue: {
            generate: jest.fn(),
          },
        },
        ConfigService,
      ],
    }).compile();

    saleService = module.get<SaleService>(SaleService);
    saleRepository = module.get<SalesRepositoryInterface>('SalesRepositoryInterface');
    pagination = module.get<PaginationInterface>('PaginationInterface');
  });

  it('should throw an error when an empty array of items is passed', async () => {
    await expect(saleService.registerSale([])).rejects.toThrow('A venda deve conter pelo menos um item.');
  });

  it('should return a successful response when a valid array of items is passed', async () => {
    const items: CreateSaleDto[] = [{ product_id: 1, quantity: 2 }];
    const newSale: SaleEntity = {
      id: 1,
      total: 10,
      created_at: new Date(),
      updated_at: new Date(),
      items: [],
    };

    jest.spyOn(saleRepository, 'register').mockResolvedValueOnce(newSale);

    const response: IDefaultResponse<SaleEntity> = await saleService.registerSale(items);
    expect(response).toBeDefined();
    expect(response.status_code).toBe(HttpStatus.CREATED);
    expect(response.success).toBe(true);
    expect(response.message).toBe('Vendas realizada com sucesso');
    expect(response.data).not.toBeNull();
  });

  it('should return a response with the correct status code', async () => {
    const items: CreateSaleDto[] = [{ product_id: 1, quantity: 2 }];
    const newSale: SaleEntity = {
      id: 1,
      total: 10,
      created_at: new Date(),
      updated_at: new Date(),
      items: [],
    };

    jest.spyOn(saleRepository, 'register').mockResolvedValueOnce(newSale);

    const response: IDefaultResponse<SaleEntity> = await saleService.registerSale(items);
    expect(response.status_code).toBe(HttpStatus.CREATED);
  });

  it('should return a response with the correct message', async () => {
    const items: CreateSaleDto[] = [{ product_id: 1, quantity: 2 }];
    const newSale: SaleEntity = {
      id: 1,
      total: 10,
      created_at: new Date(),
      updated_at: new Date(),
      items: [],
    };

    jest.spyOn(saleRepository, 'register').mockResolvedValueOnce(newSale);

    const response: IDefaultResponse<SaleEntity> = await saleService.registerSale(items);
    expect(response.message).toBe('Vendas realizada com sucesso');
  });

  it('should return a response with data not null', async () => {
    const items: CreateSaleDto[] = [{ product_id: 1, quantity: 2 }];
    const newSale: SaleEntity = {
      id: 1,
      total: 10,
      created_at: new Date(),
      updated_at: new Date(),
      items: [],
    };

    jest.spyOn(saleRepository, 'register').mockResolvedValueOnce(newSale);

    const response: IDefaultResponse<SaleEntity> = await saleService.registerSale(items);
    expect(response.data).not.toBeNull();
  });

  it('should return all sales with no filters', async () => {
    const page = 1;
    const limit = 10;
    const orderBy = 'desc';

    const countAllSalesMock = 100;
    const allSalesMock = [new SaleEntity()];
    const paginationMock = {
      currentPage: 1,
      total_pages: 10,
      total_items: 100,
      limit_per_page: 10,
      current_page: 1,
      prev_page: null,
      next_page: null,
      first_page: 1,
      last_page: 10,
    };

    jest.spyOn(saleRepository, 'countAll').mockResolvedValue(countAllSalesMock);
    jest.spyOn(saleRepository, 'findAll').mockResolvedValue(allSalesMock);
    jest.spyOn(pagination, 'generate').mockReturnValue(paginationMock);

    const result = await saleService.getAllSales(page, limit, orderBy);

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(allSalesMock);
  });

  it('should return all sales with startDate filter', async () => {
    const page = 1;
    const limit = 10;
    const orderBy = 'desc';
    const startDate = '01/01/2022';

    const countAllSalesMock = 50;
    const allSalesMock = [SaleDataBuilder()];
    const paginationMock = {
      currentPage: 1,
      total_pages: 5,
      total_items: 50,
      limit_per_page: 10,
      current_page: 1,
      prev_page: null,
      next_page: null,
      first_page: 1,
      last_page: 5,
    };

    jest.spyOn(saleRepository, 'countAll').mockResolvedValue(countAllSalesMock);
    jest.spyOn(saleRepository, 'findAll').mockResolvedValue(allSalesMock);
    jest.spyOn(pagination, 'generate').mockReturnValue(paginationMock);

    const result = await saleService.getAllSales(page, limit, orderBy, startDate);

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(allSalesMock);
  });

  it('should retrieve sales with filters', async () => {
    jest.spyOn(saleRepository, 'countAll').mockResolvedValue(10);
    jest.spyOn(saleRepository, 'findAll').mockResolvedValue([]);

    const result = await saleService.getAllSales(1, 10, 'desc', '01/01/2025', '31/12/2025', undefined, 'Product 1');

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('should handle error when sale repository throws an error', async () => {
    jest.spyOn(saleRepository, 'countAll').mockRejectedValueOnce(new Error('Error retrieving sales'));
    try {
      await saleService.getAllSales(1, 10);
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
