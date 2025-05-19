import { Test, TestingModule } from '@nestjs/testing';
import { CashFlowController } from './cash-flow.controller';
import { CashFlowService } from './cash-flow.service';
import { HttpStatus } from '@nestjs/common';

describe('CashFlowController', () => {
  let controller: CashFlowController;
  let service: CashFlowService;

  const mockCashFlowService = {
    getCashFlow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashFlowController],
      providers: [
        {
          provide: CashFlowService,
          useValue: mockCashFlowService,
        },
      ],
    }).compile();

    controller = module.get<CashFlowController>(CashFlowController);
    service = module.get<CashFlowService>(CashFlowService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCashFlow', () => {
    it('should return cash flow data', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: {
          total_income: 1000,
          total_expenses: 500,
          balance: 500,
        },
      };

      mockCashFlowService.getCashFlow.mockResolvedValue(mockResponse);

      const result = await controller.getAllCashFlow('2024-01-01', '2024-12-31');

      expect(result).toEqual(mockResponse);
      expect(mockCashFlowService.getCashFlow).toHaveBeenCalledWith('2024-01-01', '2024-12-31');
    });
  });
});
