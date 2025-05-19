import { Test, TestingModule } from '@nestjs/testing';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { HttpStatus } from '@nestjs/common';

describe('SupplierController', () => {
  let controller: SupplierController;
  let service: SupplierService;

  const mockSupplier = {
    id: 1,
    name: 'Supplier 1',
    email: 'supplier1@example.com',
    phone: '11999999999',
    address: 'Rua Example, 123',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockSupplierService = {
    createSupplier: jest.fn(),
    findAllSuppliers: jest.fn(),
    findSupplierById: jest.fn(),
    updateSupplier: jest.fn(),
    deleteSupplier: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        {
          provide: SupplierService,
          useValue: mockSupplierService,
        },
      ],
    }).compile();

    controller = module.get<SupplierController>(SupplierController);
    service = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a supplier', async () => {
      const createSupplierDto: CreateSupplierDto = {
        name: 'Supplier 1',
        email: 'supplier1@example.com',
        phone: '11999999999',
      };

      const mockResponse = {
        status_code: HttpStatus.CREATED,
        success: true,
        data: mockSupplier,
      };

      mockSupplierService.createSupplier.mockResolvedValue(mockResponse);

      const result = await controller.create(createSupplierDto);

      expect(result).toEqual(mockResponse);
      expect(mockSupplierService.createSupplier).toHaveBeenCalledWith(createSupplierDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated suppliers', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: [mockSupplier],
        pagination: {
          total_items: 1,
          total_pages: 1,
          current_page: 1,
          items_per_page: 10,
        },
      };

      mockSupplierService.findAllSuppliers.mockResolvedValue(mockResponse);

      const result = await controller.findAll(1, 10);

      expect(result).toEqual(mockResponse);
      expect(mockSupplierService.findAllSuppliers).toHaveBeenCalledWith(1, 10, 'desc', undefined);
    });

    it('should return filtered suppliers with search', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: [mockSupplier],
        pagination: {
          total_items: 1,
          total_pages: 1,
          current_page: 1,
          items_per_page: 10,
        },
      };

      mockSupplierService.findAllSuppliers.mockResolvedValue(mockResponse);

      const result = await controller.findAll(1, 10, 'desc', 'Supplier 1');

      expect(result).toEqual(mockResponse);
      expect(mockSupplierService.findAllSuppliers).toHaveBeenCalledWith(1, 10, 'desc', 'Supplier 1');
    });
  });

  describe('findOne', () => {
    it('should return a supplier by id', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: mockSupplier,
      };

      mockSupplierService.findSupplierById.mockResolvedValue(mockResponse);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockResponse);
      expect(mockSupplierService.findSupplierById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a supplier', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Updated Supplier',
        email: 'updated@example.com',
      };

      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: { ...mockSupplier, ...updateSupplierDto },
      };

      mockSupplierService.updateSupplier.mockResolvedValue(mockResponse);

      const result = await controller.update('1', updateSupplierDto);

      expect(result).toEqual(mockResponse);
      expect(mockSupplierService.updateSupplier).toHaveBeenCalledWith(1, updateSupplierDto);
    });
  });

  describe('remove', () => {
    it('should remove a supplier', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: null,
      };

      mockSupplierService.deleteSupplier.mockResolvedValue(mockResponse);

      const result = await controller.remove('1');

      expect(result).toEqual(mockResponse);
      expect(mockSupplierService.deleteSupplier).toHaveBeenCalledWith(1);
    });
  });
});
