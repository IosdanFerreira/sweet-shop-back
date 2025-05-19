import { Test, TestingModule } from '@nestjs/testing';
import { CashFlowService } from './cash-flow.service';
import { HttpStatus } from '@nestjs/common';
import { FormatDateInUsaInterface } from 'src/shared/interfaces/format-date-in-usa.interface';
import { Prisma } from '@prisma/client';

describe('CashFlowService', () => {
  let service: CashFlowService;
  let mockCashFlowRepository: any;
  let mockFormatDateInUsa: any;

  const mockCashFlow = [
    {
      id: 1,
      type: 'INCOME',
      amount: 1000,
      description: 'Test Income',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: 2,
      type: 'EXPENSE',
      amount: 500,
      description: 'Test Expense',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  beforeEach(async () => {
    mockCashFlowRepository = {
      findAll: jest.fn(),
    };

    mockFormatDateInUsa = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashFlowService,
        {
          provide: 'CashFlowRepositoryInterface',
          useValue: mockCashFlowRepository,
        },
        {
          provide: 'FormatDateInUsaInterface',
          useValue: mockFormatDateInUsa,
        },
      ],
    }).compile();

    service = module.get<CashFlowService>(CashFlowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCashFlow', () => {
    it('should return cash flow for a date range', async () => {
      const startDate = '01/01/2024';
      const endDate = '31/01/2024';
      const formattedStartDate = '2024-01-01';
      const formattedEndDate = '2024-01-31';

      mockFormatDateInUsa.execute
        .mockReturnValueOnce(formattedStartDate)
        .mockReturnValueOnce(formattedEndDate);

      mockCashFlowRepository.findAll.mockResolvedValue(mockCashFlow);

      const result = await service.getCashFlow(startDate, endDate);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCashFlow);
      expect(mockFormatDateInUsa.execute).toHaveBeenCalledWith(startDate);
      expect(mockFormatDateInUsa.execute).toHaveBeenCalledWith(endDate);
      expect(mockCashFlowRepository.findAll).toHaveBeenCalledWith({
        created_at: {
          gte: new Date(`${formattedStartDate}T00:00:00.000Z`),
          lte: new Date(`${formattedEndDate}T23:59:59.999Z`),
        },
      });
    });

    it('should return cash flow with only start date', async () => {
      const startDate = '01/01/2024';
      const formattedStartDate = '2024-01-01';

      mockFormatDateInUsa.execute.mockReturnValueOnce(formattedStartDate);

      mockCashFlowRepository.findAll.mockResolvedValue(mockCashFlow);

      const result = await service.getCashFlow(startDate, '');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCashFlow);
      expect(mockFormatDateInUsa.execute).toHaveBeenCalledWith(startDate);
      expect(mockCashFlowRepository.findAll).toHaveBeenCalledWith({
        created_at: {
          gte: new Date(`${formattedStartDate}T00:00:00.000Z`),
        },
      });
    });

    it('should return cash flow with only end date', async () => {
      const endDate = '31/01/2024';
      const formattedEndDate = '2024-01-31';

      mockFormatDateInUsa.execute.mockReturnValueOnce(formattedEndDate);

      mockCashFlowRepository.findAll.mockResolvedValue(mockCashFlow);

      const result = await service.getCashFlow('', endDate);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCashFlow);
      expect(mockFormatDateInUsa.execute).toHaveBeenCalledWith(endDate);
      expect(mockCashFlowRepository.findAll).toHaveBeenCalledWith({
        created_at: {
          lte: new Date(`${formattedEndDate}T23:59:59.999Z`),
        },
      });
    });

    it('should return cash flow without date range', async () => {
      mockCashFlowRepository.findAll.mockResolvedValue(mockCashFlow);

      const result = await service.getCashFlow('', '');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCashFlow);
      expect(mockCashFlowRepository.findAll).toHaveBeenCalledWith({});
    });
  });
});
