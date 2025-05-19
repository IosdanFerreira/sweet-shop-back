import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { SupplierEntity } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { HttpStatus } from '@nestjs/common';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';

describe('SupplierService', () => {
  let service: SupplierService;
  let mockSupplierRepository: any;
  let mockPagination: any;

  const mockSupplier: SupplierEntity = {
    id: 1,
    name: 'Test Supplier',
    email: 'test@supplier.com',
    phone: '12345678901',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockPaginationResult = {
    total_items: 1,
    total_pages: 1,
    current_page: 1,
    items_per_page: 10,
  };

  beforeEach(async () => {
    mockSupplierRepository = {
      insert: jest.fn(),
      findAll: jest.fn(),
      findAllFiltered: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      countAll: jest.fn(),
      countAllFiltered: jest.fn(),
    };

    mockPagination = {
      generate: jest.fn().mockReturnValue(mockPaginationResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: 'SupplierRepositoryInterface',
          useValue: mockSupplierRepository,
        },
        {
          provide: 'PaginationInterface',
          useValue: mockPagination,
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSupplier', () => {
    it('should create a new supplier', async () => {
      const createSupplierDto: CreateSupplierDto = {
        name: 'Test Supplier',
        email: 'test@supplier.com',
        phone: '12345678901',
      };

      mockSupplierRepository.insert.mockResolvedValue(mockSupplier);

      const result = await service.createSupplier(createSupplierDto);

      expect(result.status_code).toBe(HttpStatus.CREATED);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSupplier);
      expect(mockSupplierRepository.insert).toHaveBeenCalledWith(createSupplierDto);
    });
  });

  describe('findAllSuppliers', () => {
    it('should return all suppliers without search', async () => {
      mockSupplierRepository.findAll.mockResolvedValue([mockSupplier]);
      mockSupplierRepository.countAll.mockResolvedValue(1);

      const result = await service.findAllSuppliers(1, 10, 'desc');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockSupplier]);
      expect(result.pagination).toEqual(mockPaginationResult);
      expect(mockSupplierRepository.findAll).toHaveBeenCalledWith(1, 10, 'desc');
      expect(mockSupplierRepository.countAll).toHaveBeenCalled();
    });

    it('should return filtered suppliers with search', async () => {
      mockSupplierRepository.findAllFiltered.mockResolvedValue([mockSupplier]);
      mockSupplierRepository.countAllFiltered.mockResolvedValue(1);

      const result = await service.findAllSuppliers(1, 10, 'desc', 'test');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockSupplier]);
      expect(result.pagination).toEqual(mockPaginationResult);
      expect(mockSupplierRepository.findAllFiltered).toHaveBeenCalledWith(1, 10, 'desc', 'test');
      expect(mockSupplierRepository.countAllFiltered).toHaveBeenCalledWith('test');
    });
  });

  describe('findSupplierById', () => {
    it('should return a supplier by id', async () => {
      mockSupplierRepository.findById.mockResolvedValue(mockSupplier);

      const result = await service.findSupplierById(1);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockSupplier);
      expect(mockSupplierRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when supplier is not found', async () => {
      mockSupplierRepository.findById.mockResolvedValue(null);

      await expect(service.findSupplierById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateSupplier', () => {
    it('should update a supplier', async () => {
      const updateSupplierDto: UpdateSupplierDto = {
        name: 'Updated Supplier',
      };

      const updatedSupplier = { ...mockSupplier, ...updateSupplierDto };
      mockSupplierRepository.findById.mockResolvedValue(mockSupplier);
      mockSupplierRepository.update.mockResolvedValue(updatedSupplier);

      const result = await service.updateSupplier(1, updateSupplierDto);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedSupplier);
      expect(mockSupplierRepository.update).toHaveBeenCalledWith(1, updateSupplierDto);
    });

    it('should throw NotFoundError when supplier is not found', async () => {
      mockSupplierRepository.findById.mockResolvedValue(null);

      await expect(service.updateSupplier(999, { name: 'Updated' })).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError when no update data is provided', async () => {
      mockSupplierRepository.findById.mockResolvedValue(mockSupplier);

      await expect(service.updateSupplier(1, {})).rejects.toThrow(BadRequestError);
    });
  });

  describe('deleteSupplier', () => {
    it('should remove a supplier', async () => {
      mockSupplierRepository.findById.mockResolvedValue(mockSupplier);
      mockSupplierRepository.remove.mockResolvedValue(undefined);

      const result = await service.deleteSupplier(1);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(mockSupplierRepository.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when supplier is not found', async () => {
      mockSupplierRepository.findById.mockResolvedValue(null);

      await expect(service.deleteSupplier(999)).rejects.toThrow(NotFoundError);
    });
  });
}); 