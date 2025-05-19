import { Test, TestingModule } from '@nestjs/testing';

import { APP_PIPE } from '@nestjs/core';
import { CategoryModule } from '../category/category.module';
import { ConfigService } from '@nestjs/config';
import { HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ProductEntity } from '../products/entities/product.entity';
import { ProductRepository } from '../products/repositories/product.repository';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { ReportService } from './report.service';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { SupplierModule } from '../supplier/supplier.module';
import { CategoryEntity } from '../category/entities/category.entity';
import { SupplierEntity } from '../supplier/entities/supplier.entity';

describe('ReportService', () => {
  let service: ReportService;
  let mockReportRepository: any;
  let mockProductsService: any;

  const mockCategory: CategoryEntity = {
    id: 1,
    name: 'Test Category',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockSupplier: SupplierEntity = {
    id: 1,
    name: 'Test Supplier',
    email: 'test@supplier.com',
    phone: '12345678901',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockProduct: ProductEntity = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    purchase_price: 10.0,
    selling_price: 20.0,
    stock: 100,
    category: mockCategory,
    supplier: mockSupplier,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    mockReportRepository = {
      findGroupSales: jest.fn(),
      findSellingTopProducts: jest.fn(),
    };

    mockProductsService = {
      findProductById: jest.fn(),
    };

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
          useValue: mockReportRepository,
        },
        {
          provide: 'ProductRepositoryInterface',
          useClass: ProductRepository,
        },
        ConfigService,
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSalesReport', () => {
    it('should return sales report grouped by month and year', async () => {
      const mockSales = [
        {
          created_at: new Date('2024-01-15'),
          _count: { id: 5 },
        },
        {
          created_at: new Date('2024-01-20'),
          _count: { id: 3 },
        },
        {
          created_at: new Date('2024-02-10'),
          _count: { id: 4 },
        },
      ];

      mockReportRepository.findGroupSales.mockResolvedValue(mockSales);

      const result = await service.getSalesReport();

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { month: '01/2024', total_sales: 8 },
        { month: '02/2024', total_sales: 4 },
      ]);
      expect(mockReportRepository.findGroupSales).toHaveBeenCalled();
    });

    it('should return not found when no sales data exists', async () => {
      mockReportRepository.findGroupSales.mockResolvedValue([]);

      const result = await service.getSalesReport();

      expect(result.status_code).toBe(HttpStatus.NOT_FOUND);
      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.message).toBe('Relatório de vendas não encontrado');
      expect(mockReportRepository.findGroupSales).toHaveBeenCalled();
    });
  });

  describe('getSellingTopProducts', () => {
    it('should return top selling products', async () => {
      const mockTopProducts = [
        {
          product_id: 1,
          _sum: { quantity: 10 },
        },
        {
          product_id: 2,
          _sum: { quantity: 5 },
        },
      ];

      mockReportRepository.findSellingTopProducts.mockResolvedValue(mockTopProducts);
      mockProductsService.findProductById.mockResolvedValue({
        status_code: HttpStatus.OK,
        success: true,
        data: mockProduct,
      });

      const result = await service.getSellingTopProducts();

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        { product: mockProduct, quantity_sold: 10 },
        { product: mockProduct, quantity_sold: 5 },
      ]);
      expect(mockReportRepository.findSellingTopProducts).toHaveBeenCalled();
      expect(mockProductsService.findProductById).toHaveBeenCalledTimes(2);
    });

    it('should handle empty top products list', async () => {
      mockReportRepository.findSellingTopProducts.mockResolvedValue([]);

      const result = await service.getSellingTopProducts();

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(mockReportRepository.findSellingTopProducts).toHaveBeenCalled();
    });
  });
});
