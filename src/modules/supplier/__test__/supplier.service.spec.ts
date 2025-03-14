import { Test, TestingModule } from '@nestjs/testing';

import { APP_PIPE } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { HttpStatus } from '@nestjs/common';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { RemoveAccents } from 'src/shared/utils/remove-accents';
import { SupplierEntity } from '../entities/supplier.entity';
import { SupplierRepository } from '../repositories/supplier.repository';
import { SupplierRepositoryInterface } from '../interfaces/supplier-repository.interface';
import { SupplierService } from '../supplier.service';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('SupplierService', () => {
  let supplierService: SupplierService;
  let supplierRepository: SupplierRepositoryInterface;
  let pagination: PaginationInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        PrismaService,
        {
          provide: APP_PIPE,
          useValue: { transform: jest.fn() },
        },
        {
          provide: 'SupplierRepositoryInterface',
          useClass: SupplierRepository,
        },
        {
          provide: 'RemoveAccentsInterface',
          useClass: RemoveAccents,
        },
        {
          provide: 'PaginationInterface',
          useValue: {
            generate: jest.fn(),
          },
        },
        ConfigService,
      ],
    }).compile();

    supplierService = module.get<SupplierService>(SupplierService);
    supplierRepository = module.get<SupplierRepositoryInterface>('SupplierRepositoryInterface');
    pagination = module.get<PaginationInterface>('PaginationInterface');
  });

  it('should create a supplier successfully', async () => {
    const input: CreateSupplierDto = { name: 'Test Supplier', email: 'test@example.com', phone: '(11) 11222-3344' };

    const output: SupplierEntity = {
      id: 1,
      name: 'Test Supplier',
      email: 'test@example.com',
      phone: '(11) 11222-3344',
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(supplierRepository, 'insert').mockResolvedValueOnce(output);

    const result: SupplierEntity = await supplierRepository.insert(input);

    expect(result).toStrictEqual(output);
    expect(supplierRepository.insert).toHaveBeenCalledWith(input);
  });

  it('should handle error when supplier repository insertion fails', async () => {
    const input: CreateSupplierDto = {
      name: 'Test Supplier',
      email: 'test@example.com',
      phone: '1234567890',
    };

    jest.spyOn(supplierRepository, 'insert').mockRejectedValueOnce(new Error('Insertion failed'));

    try {
      await supplierService.createSupplier(input);
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Insertion failed');
    }
  });

  it('should return suppliers with search query', async () => {
    const search = 'test';
    const page = 1;
    const limit = 10;
    const orderBy = 'asc';

    const filteredTotalItems = 10;
    const filteredSuppliers = [new SupplierEntity()];

    jest.spyOn(supplierRepository, 'countAllFiltered').mockResolvedValue(filteredTotalItems);
    jest.spyOn(supplierRepository, 'findAllFiltered').mockResolvedValue(filteredSuppliers);
    jest.spyOn(pagination, 'generate').mockResolvedValue({} as never);

    const result = await supplierService.findAllSuppliers(page, limit, orderBy, search);

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toBe(filteredSuppliers);
  });

  it('should return all suppliers without search query', async () => {
    const page = 1;
    const limit = 10;
    const orderBy = 'asc';

    const totalItems = 10;
    const allSuppliers = [new SupplierEntity()];

    jest.spyOn(supplierRepository, 'countAll').mockResolvedValue(totalItems);
    jest.spyOn(supplierRepository, 'findAll').mockResolvedValue(allSuppliers);
    jest.spyOn(pagination, 'generate').mockReturnValue({} as never);

    const result = await supplierService.findAllSuppliers(page, limit, orderBy);

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toBe(allSuppliers);
  });

  it('should throw error with invalid page or limit', async () => {
    const page = -1;
    const limit = 10;
    const orderBy = 'asc';

    await expect(supplierService.findAllSuppliers(page, limit, orderBy)).rejects.toThrow();
  });

  it('should throw error with invalid orderBy', async () => {
    const page = 1;
    const limit = 10;
    const orderBy = 'invalid' as any;

    await expect(supplierService.findAllSuppliers(page, limit, orderBy)).rejects.toThrow();
  });

  it('should return supplier by ID', async () => {
    const id = 1;
    const supplier = new SupplierEntity();
    jest.spyOn(supplierRepository, 'findById').mockResolvedValueOnce(supplier);

    const result = await supplierService.findSupplierById(id);

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toBe(supplier);
  });

  it('should throw error when supplier is not found', async () => {
    const id = 1;
    jest
      .spyOn(supplierRepository, 'findById')
      .mockRejectedValueOnce(new NotFoundError([{ property: null, message: 'Supplier not found' }]));

    try {
      await supplierService.findSupplierById(id);
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  it('should update supplier with valid data', async () => {
    const id = 1;
    const updateSupplierDto: UpdateSupplierDto = { name: 'New Name', email: 'new@example.com' };
    const updatedSupplier: SupplierEntity = {
      id,
      name: 'New Name',
      email: 'new@example.com',
      phone: '(11) 12345-7890',
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(supplierRepository, 'update').mockResolvedValueOnce(updatedSupplier);
    jest.spyOn(supplierRepository, 'findById').mockResolvedValueOnce({
      id,
      name: 'Old Name',
      email: 'old@example.com',
      phone: '(11) 12345-7890',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const result = await supplierService.updateSupplier(id, updateSupplierDto);

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toBe(updatedSupplier);
  });

  it('should throw error with empty update data', async () => {
    const input = plainToInstance(UpdateSupplierDto, {
      name: '',
      email: '',
      phone: '',
    } as UpdateSupplierDto);

    const errors = await validate(input);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw error with non-existent supplier ID', async () => {
    const id = 1;
    const updateSupplierDto: UpdateSupplierDto = { name: 'New Name', email: 'new@example.com' };

    jest.spyOn(supplierRepository, 'findById').mockRejectedValueOnce(new Error('Supplier not found'));

    try {
      await supplierService.updateSupplier(id, updateSupplierDto);
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Supplier not found');
    }
  });

  it('should delete supplier successfully', async () => {
    const id = 1;
    jest.spyOn(supplierRepository, 'findById').mockResolvedValueOnce({
      id,
      name: 'Test Supplier',
      email: 'test@example.com',
      phone: '(11) 11222-3344',
      created_at: new Date(),
      updated_at: new Date(),
    } as SupplierEntity);
    jest.spyOn(supplierRepository, 'remove').mockResolvedValueOnce();

    const result = await supplierService.deleteSupplier(id);

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Fornecedor excluído com sucesso');
  });

  it('should throw error when supplier is not found', async () => {
    const id = 1;
    jest
      .spyOn(supplierRepository, 'findById')
      .mockRejectedValueOnce(new NotFoundError([{ property: null, message: 'Supplier not found' }]));

    try {
      await supplierService.deleteSupplier(id);
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  it('should throw error when supplier repository removal fails', async () => {
    const id = 1;
    jest.spyOn(supplierRepository, 'findById').mockResolvedValueOnce({
      id,
      name: 'Test Supplier',
      phone: '(11) 11222-3344',
      email: 'test@example.com',
      created_at: new Date(),
      updated_at: new Date(),
    });
    jest.spyOn(supplierRepository, 'remove').mockRejectedValueOnce(new Error('Removal failed'));

    try {
      await supplierService.deleteSupplier(id);
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Removal failed');
    }
  });
});
