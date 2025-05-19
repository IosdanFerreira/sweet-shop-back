import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { HttpStatus } from '@nestjs/common';

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  const mockReportService = {
    getSalesReport: jest.fn(),
    getSellingTopProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: mockReportService,
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSales', () => {
    it('should return sales report', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: {
          total_sales: 1000,
          total_revenue: 5000,
          average_ticket: 500,
        },
      };

      mockReportService.getSalesReport.mockResolvedValue(mockResponse);

      const result = await controller.getSales();

      expect(result).toEqual(mockResponse);
      expect(mockReportService.getSalesReport).toHaveBeenCalled();
    });
  });

  describe('getProducts', () => {
    it('should return top products report', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: [
          {
            product_id: 1,
            name: 'Product 1',
            total_sold: 100,
            revenue: 1000,
          },
        ],
      };

      mockReportService.getSellingTopProducts.mockResolvedValue(mockResponse);

      const result = await controller.getProducts();

      expect(result).toEqual(mockResponse);
      expect(mockReportService.getSellingTopProducts).toHaveBeenCalled();
    });
  });
});
