import { Test, TestingModule } from '@nestjs/testing';

import { APP_PIPE } from '@nestjs/core';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { FormatDateInUsa } from 'src/shared/utils/format-date-in-usa';
import { HttpStatus } from '@nestjs/common';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDataBuilder } from '../../../products/__tests__/testing/product-data-builder';
import { ProductEntity } from '../../../products/entities/product.entity';
import { ProductsModule } from '../../../products/products.module';
import { ProductsService } from '../../../products/products.service';
import { RemoveAccents } from 'src/shared/utils/remove-accents';
import { StockMovementDataBuilder } from '../testing/stock-movements-data-builder';
import { StockMovementEntity } from '../../entities/stock-movement.entity';
import { StockMovementsRepository } from '../../repositories/stock-movements.repository';
import { StockMovementsRepositoryInterface } from '../../interfaces/stock-movements-repository.interface';
import { StockMovementsService } from '../../stock-movements.service';

describe('StockMovementsService unit tests', () => {
  let stockMovementsService: StockMovementsService;
  let productsService: ProductsService;
  let stockMovementsRepository: StockMovementsRepositoryInterface;
  let pagination: PaginationInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
      providers: [
        StockMovementsService,
        PrismaService,
        {
          provide: APP_PIPE,
          useValue: { transform: jest.fn() },
        },
        {
          provide: 'StockMovementsRepositoryInterface',
          useClass: StockMovementsRepository,
        },
        {
          provide: 'RemoveAccentsInterface',
          useClass: RemoveAccents,
        },
        {
          provide: 'FormatDateInUsaInterface',
          useClass: FormatDateInUsa,
        },
        {
          provide: 'PaginationInterface',
          useValue: {
            generate: jest.fn(),
          },
        },
        {
          provide: 'HashProviderInterface',
          useValue: {
            hash: jest.fn().mockResolvedValue('hashed-password'),
            compare: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    stockMovementsService = module.get<StockMovementsService>(StockMovementsService);
    productsService = module.get<ProductsService>(ProductsService);
    stockMovementsRepository = module.get<StockMovementsRepositoryInterface>('StockMovementsRepositoryInterface');
    pagination = module.get<PaginationInterface>('PaginationInterface');
  });

  it('should return a successful response with a created stock movement', async () => {
    const input = { product_id: 1, quantity: 10 };

    const mockProduct: ProductEntity = ProductDataBuilder();

    const mockStockMovement: StockMovementEntity = StockMovementDataBuilder();

    const mockProductResponse: IDefaultResponse<ProductEntity> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Produto encontrado com sucesso',
      data: mockProduct,
      pagination: null,
    };

    jest.spyOn(productsService, 'findProductById').mockResolvedValueOnce(mockProductResponse);

    jest.spyOn(stockMovementsRepository, 'registerEntry').mockResolvedValueOnce(mockStockMovement);

    const output: IDefaultResponse<StockMovementEntity> = await stockMovementsService.registerStockEntry(input);

    expect(output.status_code).toBe(HttpStatus.CREATED);
    expect(output.success).toBe(true);
    expect(output.data).toEqual(mockStockMovement);
  });

  it('should throw error when product not found', async () => {
    const createStockMovementDto = {
      product_id: 1,
      quantity: 10,
    };

    jest
      .spyOn(productsService, 'findProductById')
      .mockRejectedValueOnce(new NotFoundError([{ property: null, message: 'Product not found' }]));

    await expect(stockMovementsService.registerStockEntry(createStockMovementDto)).rejects.toThrow(NotFoundError);
  });

  it('should throw error when stock movement registration fails', async () => {
    const createStockMovementDto = {
      product_id: 1,
      quantity: 10,
    };

    const mockProduct: ProductEntity = ProductDataBuilder();

    const mockProductResponse: IDefaultResponse<ProductEntity> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Produto encontrado com sucesso',
      data: mockProduct,
      pagination: null,
    };

    jest.spyOn(productsService, 'findProductById').mockResolvedValueOnce(mockProductResponse);
    jest
      .spyOn(stockMovementsRepository, 'registerEntry')
      .mockRejectedValueOnce(new BadRequestError([{ property: null, message: 'Stock movement registration failed' }]));

    await expect(stockMovementsService.registerStockEntry(createStockMovementDto)).rejects.toThrow(BadRequestError);
  });

  it('should throw error when product not found', async () => {
    const input = { product_id: 1, quantity: 10 };
    jest
      .spyOn(productsService, 'findProductById')
      .mockRejectedValueOnce(new NotFoundError([{ property: null, message: 'Product not found' }]));

    await expect(stockMovementsService.registerStockExit(input)).rejects.toThrow(NotFoundError);
  });

  it('should throw error when stock movement registration fails', async () => {
    const input = { product_id: 1, quantity: 10 };

    const mockProductResponse = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Product found',
      data: {},
      pagination: null,
    };
    jest.spyOn(productsService, 'findProductById').mockResolvedValueOnce(mockProductResponse as any);
    jest
      .spyOn(stockMovementsRepository, 'registerExit')
      .mockRejectedValueOnce(new BadRequestError([{ property: null, message: 'Stock movement registration failed' }]));

    await expect(stockMovementsService.registerStockExit(input)).rejects.toThrow(BadRequestError);
  });

  it('should return a successful response with a created stock movement', async () => {
    const createStockMovementDto = { product_id: 1, quantity: 10 };
    const mockProductResponse = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Product found',
      data: {},
      pagination,
    };
    const mockStockMovement: StockMovementEntity = StockMovementDataBuilder();

    jest.spyOn(productsService, 'findProductById').mockResolvedValueOnce(mockProductResponse as any);
    jest.spyOn(stockMovementsRepository, 'registerExit').mockResolvedValueOnce(mockStockMovement);

    const output: IDefaultResponse<StockMovementEntity> =
      await stockMovementsService.registerStockExit(createStockMovementDto);
    expect(output.status_code).toBe(HttpStatus.CREATED);
    expect(output.success).toBe(true);
    expect(output.data).toEqual(mockStockMovement);
  });

  it('should return stock movements with pagination and filters applied', async () => {
    const page = 1;
    const limit = 10;
    const orderBy = 'desc';
    const startDate = '01/01/2024';
    const endDate = '31/12/2024';
    const productName = 'Produto 1';

    const stockMovementsMock = [StockMovementDataBuilder()];

    const totalItemsMock = 1;
    const paginationMock = {
      currentPage: 1,
      total_pages: 1,
      total_items: 1,
      limit_per_page: 10,
      current_page: 1,
      prev_page: null,
      next_page: null,
      first_page: 1,
      last_page: 1,
    };

    jest.spyOn(stockMovementsRepository, 'countAll').mockResolvedValue(totalItemsMock);
    jest.spyOn(stockMovementsRepository, 'getMovements').mockResolvedValue(stockMovementsMock);
    jest.spyOn(pagination, 'generate').mockReturnValue(paginationMock);

    const result = await stockMovementsService.findAllStockMovements(
      page,
      limit,
      orderBy,
      startDate,
      endDate,
      undefined,
      productName,
    );

    expect(stockMovementsRepository.countAll).toHaveBeenCalledWith({
      created_at: { gte: new Date('2024-01-01T00:00:00.000Z'), lte: new Date('2024-12-31T23:59:59.999Z') },
      product: {
        OR: [
          { name: { contains: productName, mode: 'insensitive' } },
          { name_unaccented: { contains: productName, mode: 'insensitive' } },
        ],
      },
    });

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(stockMovementsMock);
  });

  it('should return empty data when no stock movements are found', async () => {
    const page = 1;
    const limit = 10;
    const orderBy = 'desc';

    // Mock do retorno dos métodos do repositório
    const stockMovementsMock = [];
    const totalItemsMock = 0;
    const paginationMock = {
      currentPage: 1,
      total_pages: 1,
      total_items: 0,
      limit_per_page: 10,
      current_page: 1,
      prev_page: null,
      next_page: null,
      first_page: 1,
      last_page: 1,
    };

    jest.spyOn(stockMovementsRepository, 'countAll').mockResolvedValue(totalItemsMock);
    jest.spyOn(stockMovementsRepository, 'getMovements').mockResolvedValue(stockMovementsMock);
    jest.spyOn(pagination, 'generate').mockReturnValue(paginationMock);

    // Chamada do método
    const result = await stockMovementsService.findAllStockMovements(page, limit, orderBy);

    // Validações
    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });
});
