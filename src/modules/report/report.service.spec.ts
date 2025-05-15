import { Test, TestingModule } from '@nestjs/testing';

import { APP_PIPE } from '@nestjs/core';
import { CategoryModule } from '../category/category.module';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ProductDataBuilder } from '../products/__tests__/testing/product-data-builder';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductRepository } from '../products/repositories/product.repository';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { ReportRepository } from './repositories/report.repository';
import { ReportRepositoryInterface } from './interfaces/report-repository.interface';
import { ReportService } from './report.service';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { SupplierModule } from '../supplier/supplier.module';

describe('ReportService', () => {
  let reportService: ReportService;
  let productsService: ProductsService;
  let reportRepository: ReportRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, SupplierModule, CategoryModule, ProductsModule],
      providers: [
        ReportService,
        PrismaService,
        {
          provide: APP_PIPE,
          useValue: { transform: jest.fn() },
        },
        {
          provide: 'ReportRepositoryInterface',
          useClass: ReportRepository,
        },
        {
          provide: 'ProductRepositoryInterface',
          useClass: ProductRepository,
        },
        ConfigService,
      ],
    }).compile();

    reportService = module.get<ReportService>(ReportService);
    reportRepository = module.get<ReportRepositoryInterface>('ReportRepositoryInterface');
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should return a successful sales report', async () => {
    const salesByMonth = [
      { created_at: new Date('2025-01-01T00:00:00.000Z'), _count: { id: 10 } },
      { created_at: new Date('2025-02-01T00:00:00.000Z'), _count: { id: 20 } },
    ];

    jest.spyOn(reportRepository, 'findGroupSales').mockResolvedValue(salesByMonth);

    const result = await reportService.getSalesReport();

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toEqual([
      { month: '01/2025', total_sales: 10 },
      { month: '02/2025', total_sales: 20 },
    ]);
  });

  it('should return an error when findGroupSales returns an empty array', async () => {
    jest.spyOn(reportRepository, 'findGroupSales').mockResolvedValue([]);

    const result = await reportService.getSalesReport();

    expect(result.status_code).toBe(HttpStatus.NOT_FOUND);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Relatório de vendas não encontrado');
  });

  it('should return top selling products successfully', async () => {
    const topProducts = [
      { product_id: 1, _sum: { quantity: 10 } },
      { product_id: 2, _sum: { quantity: 20 } },
    ];

    const product1: IDefaultResponse<ProductEntity> = {
      status_code: HttpStatus.OK,
      success: true,
      message: 'Product found',
      data: ProductDataBuilder(),
      pagination: null,
      error_type: null,
      errors: null,
    };

    const product2: IDefaultResponse<ProductEntity> = {
      status_code: HttpStatus.OK,
      success: true,
      message: 'Product found',
      data: ProductDataBuilder({ id: 2 }),
      pagination: null,
      error_type: null,
      errors: null,
    };

    jest.spyOn(reportRepository, 'findSellingTopProducts').mockResolvedValue(topProducts);
    jest.spyOn(productsService, 'findProductById').mockResolvedValueOnce(product1);
    jest.spyOn(productsService, 'findProductById').mockResolvedValueOnce(product2);

    const result = await reportService.getSellingTopProducts();

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toEqual([
      { product: product1.data, quantity_sold: 10 },
      { product: product2.data, quantity_sold: 20 },
    ]);
  });

  it('should return empty list of top selling products', async () => {
    jest.spyOn(reportRepository, 'findSellingTopProducts').mockResolvedValue([]);

    const result = await reportService.getSellingTopProducts();

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('should throw error when finding product by ID fails', async () => {
    const topProducts = [{ product_id: 1, _sum: { quantity: 10 } }];

    jest.spyOn(reportRepository, 'findSellingTopProducts').mockResolvedValue(topProducts);
    jest.spyOn(productsService, 'findProductById').mockResolvedValueOnce(null);

    await expect(reportService.getSellingTopProducts()).rejects.toThrow(TypeError);
  });

  it('should throw error when repository call fails', async () => {
    jest.spyOn(reportRepository, 'findSellingTopProducts').mockResolvedValue(null);

    await expect(reportService.getSellingTopProducts()).rejects.toThrow(TypeError);
  });
});
