import { Test, TestingModule } from '@nestjs/testing';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { RegisterSaleDto, SaleItemDto } from './dto/register-sale.dto';
import { HttpStatus } from '@nestjs/common';

describe('SaleController', () => {
  let controller: SaleController;
  let service: SaleService;

  const mockSale = {
    id: 1,
    total: 100,
    payment_method: 'credit_card',
    status: 'completed',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockSalesRepository = {
    register: jest.fn(),
    findAll: jest.fn(),
    countAll: jest.fn(),
  };

  const mockFormatDateInUsa = {
    execute: jest.fn().mockImplementation((date: string) => date),
  };

  const mockRemoveAccents = {
    execute: jest.fn().mockImplementation((text: string) => text),
  };

  const mockPagination = {
    generate: jest.fn().mockReturnValue({
      total_items: 1,
      total_pages: 1,
      current_page: 1,
      items_per_page: 10,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleController],
      providers: [
        SaleService,
        {
          provide: 'SalesRepositoryInterface',
          useValue: mockSalesRepository,
        },
        {
          provide: 'FormatDateInUsaInterface',
          useValue: mockFormatDateInUsa,
        },
        {
          provide: 'RemoveAccentsInterface',
          useValue: mockRemoveAccents,
        },
        {
          provide: 'PaginationInterface',
          useValue: mockPagination,
        },
      ],
    }).compile();

    controller = module.get<SaleController>(SaleController);
    service = module.get<SaleService>(SaleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerSale', () => {
    it('should register a sale', async () => {
      const registerSaleDto: RegisterSaleDto = {
        items: [
          {
            product_id: 1,
            quantity: 2,
          },
        ],
      };

      mockSalesRepository.register.mockResolvedValue(mockSale);

      const result = await controller.registerSale(registerSaleDto);

      expect(result.status_code).toBe(HttpStatus.CREATED);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSale);
      expect(mockSalesRepository.register).toHaveBeenCalledWith(registerSaleDto.items);
    });
  });

  describe('GetAllSales', () => {
    it('should return paginated sales', async () => {
      mockSalesRepository.findAll.mockResolvedValue([mockSale]);
      mockSalesRepository.countAll.mockResolvedValue(1);

      const result = await controller.GetAllSales(1, 10);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockSale]);
      expect(mockSalesRepository.findAll).toHaveBeenCalled();
      expect(mockSalesRepository.countAll).toHaveBeenCalled();
    });

    it('should return filtered sales with date range', async () => {
      mockSalesRepository.findAll.mockResolvedValue([mockSale]);
      mockSalesRepository.countAll.mockResolvedValue(1);

      const result = await controller.GetAllSales(1, 10, 'desc', '2024-01-01', '2024-12-31');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockSale]);
      expect(mockSalesRepository.findAll).toHaveBeenCalled();
      expect(mockSalesRepository.countAll).toHaveBeenCalled();
    });
  });
});
