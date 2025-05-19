import { Test, TestingModule } from '@nestjs/testing';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { HttpStatus } from '@nestjs/common';

describe('StockMovementsController', () => {
  let controller: StockMovementsController;
  let service: StockMovementsService;

  const mockStockMovement = {
    id: 1,
    product_id: 1,
    quantity: 10,
    type: 'increase',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockStockMovementsService = {
    registerStockEntry: jest.fn(),
    registerStockExit: jest.fn(),
    findAllStockMovements: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockMovementsController],
      providers: [
        {
          provide: StockMovementsService,
          useValue: mockStockMovementsService,
        },
      ],
    }).compile();

    controller = module.get<StockMovementsController>(StockMovementsController);
    service = module.get<StockMovementsService>(StockMovementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createStockEntryIncrease', () => {
    it('should register a stock increase', async () => {
      const createStockMovementDto: CreateStockMovementDto = {
        product_id: 1,
        quantity: 10,
      };

      const mockResponse = {
        status_code: HttpStatus.CREATED,
        success: true,
        data: mockStockMovement,
      };

      mockStockMovementsService.registerStockEntry.mockResolvedValue(mockResponse);

      const result = await controller.createStockEntryIncrease(createStockMovementDto);

      expect(result).toEqual(mockResponse);
      expect(mockStockMovementsService.registerStockEntry).toHaveBeenCalledWith(createStockMovementDto);
    });
  });

  describe('createStockEntryDecrease', () => {
    it('should register a stock decrease', async () => {
      const createStockMovementDto: CreateStockMovementDto = {
        product_id: 1,
        quantity: 5,
      };

      const mockResponse = {
        status_code: HttpStatus.CREATED,
        success: true,
        data: { ...mockStockMovement, type: 'decrease', quantity: 5 },
      };

      mockStockMovementsService.registerStockExit.mockResolvedValue(mockResponse);

      const result = await controller.createStockEntryDecrease(createStockMovementDto);

      expect(result).toEqual(mockResponse);
      expect(mockStockMovementsService.registerStockExit).toHaveBeenCalledWith(createStockMovementDto);
    });
  });

  describe('GetAllStockMovements', () => {
    it('should return paginated stock movements', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: [mockStockMovement],
        pagination: {
          total_items: 1,
          total_pages: 1,
          current_page: 1,
          items_per_page: 10,
        },
      };

      mockStockMovementsService.findAllStockMovements.mockResolvedValue(mockResponse);

      const result = await controller.GetAllStockMovements(1, 10);

      expect(result).toEqual(mockResponse);
      expect(mockStockMovementsService.findAllStockMovements).toHaveBeenCalledWith(1, 10, 'desc', undefined, undefined, undefined, undefined);
    });

    it('should return filtered stock movements', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: [mockStockMovement],
        pagination: {
          total_items: 1,
          total_pages: 1,
          current_page: 1,
          items_per_page: 10,
        },
      };

      mockStockMovementsService.findAllStockMovements.mockResolvedValue(mockResponse);

      const result = await controller.GetAllStockMovements(
        1,
        10,
        'desc',
        '2024-01-01',
        '2024-12-31',
        undefined,
        'Product 1',
      );

      expect(result).toEqual(mockResponse);
      expect(mockStockMovementsService.findAllStockMovements).toHaveBeenCalledWith(
        1,
        10,
        'desc',
        '2024-01-01',
        '2024-12-31',
        undefined,
        'Product 1',
      );
    });
  });
});
