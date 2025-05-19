import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { HttpStatus } from '@nestjs/common';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { CategoryService } from '../category/category.service';
import { SupplierService } from '../supplier/supplier.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { SupplierEntity } from '../supplier/entities/supplier.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductRepository: any;
  let mockPagination: any;
  let mockCategoryService: any;
  let mockSupplierService: any;

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

  const mockPaginationResult = {
    total_items: 1,
    total_pages: 1,
    current_page: 1,
    items_per_page: 10,
  };

  beforeEach(async () => {
    mockProductRepository = {
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

    mockCategoryService = {
      findCategoryById: jest.fn(),
    };

    mockSupplierService = {
      findSupplierById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: 'ProductRepositoryInterface',
          useValue: mockProductRepository,
        },
        {
          provide: 'PaginationInterface',
          useValue: mockPagination,
        },
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
        {
          provide: SupplierService,
          useValue: mockSupplierService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        purchase_price: 10.0,
        selling_price: 20.0,
        stock: 100,
        category_id: 1,
        supplier_id: 1,
      };

      mockCategoryService.findCategoryById.mockResolvedValue({ data: mockCategory });
      mockSupplierService.findSupplierById.mockResolvedValue({ data: mockSupplier });
      mockProductRepository.insert.mockResolvedValue(mockProduct);

      const result = await service.createProduct(createProductDto);

      expect(result.status_code).toBe(HttpStatus.CREATED);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProduct);
      expect(mockCategoryService.findCategoryById).toHaveBeenCalledWith(1);
      expect(mockSupplierService.findSupplierById).toHaveBeenCalledWith(1);
      expect(mockProductRepository.insert).toHaveBeenCalledWith(createProductDto);
    });

    it('should throw NotFoundError when category is not found', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        purchase_price: 10.0,
        selling_price: 20.0,
        stock: 100,
        category_id: 999,
        supplier_id: 1,
      };

      mockCategoryService.findCategoryById.mockRejectedValue(new NotFoundError('Category not found'));

      await expect(service.createProduct(createProductDto)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when supplier is not found', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        purchase_price: 10.0,
        selling_price: 20.0,
        stock: 100,
        category_id: 1,
        supplier_id: 999,
      };

      mockCategoryService.findCategoryById.mockResolvedValue({ data: mockCategory });
      mockSupplierService.findSupplierById.mockRejectedValue(new NotFoundError('Supplier not found'));

      await expect(service.createProduct(createProductDto)).rejects.toThrow(NotFoundError);
    });
  });

  describe('findAllProducts', () => {
    it('should return all products without search', async () => {
      mockProductRepository.findAll.mockResolvedValue([mockProduct]);
      mockProductRepository.countAll.mockResolvedValue(1);

      const result = await service.findAllProducts(1, 10, 'desc');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockProduct]);
      expect(result.pagination).toEqual(mockPaginationResult);
      expect(mockProductRepository.findAll).toHaveBeenCalledWith(1, 10, 'desc');
      expect(mockProductRepository.countAll).toHaveBeenCalled();
    });

    it('should return filtered products with search', async () => {
      mockProductRepository.findAllFiltered.mockResolvedValue([mockProduct]);
      mockProductRepository.countAllFiltered.mockResolvedValue(1);

      const result = await service.findAllProducts(1, 10, 'desc', 'test');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockProduct]);
      expect(result.pagination).toEqual(mockPaginationResult);
      expect(mockProductRepository.findAllFiltered).toHaveBeenCalledWith(1, 10, 'desc', 'test');
      expect(mockProductRepository.countAllFiltered).toHaveBeenCalledWith('test');
    });
  });

  describe('findProductById', () => {
    it('should return a product by id', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.findProductById(1);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProduct);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when product is not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(service.findProductById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        selling_price: 25.0,
      };

      const updatedProduct = { ...mockProduct, ...updateProductDto };
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.update.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct(1, updateProductDto);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedProduct);
      expect(mockProductRepository.update).toHaveBeenCalledWith(1, updateProductDto);
    });

    it('should throw NotFoundError when product is not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };

      await expect(service.updateProduct(999, updateProductDto)).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError when no update data is provided', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const emptyUpdateProductDto: UpdateProductDto = {};

      await expect(service.updateProduct(1, emptyUpdateProductDto)).rejects.toThrow(BadRequestError);
    });
  });

  describe('deleteProduct', () => {
    it('should remove a product', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);
      mockProductRepository.remove.mockResolvedValue(undefined);

      const result = await service.deleteProduct(1);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(mockProductRepository.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when product is not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(service.deleteProduct(999)).rejects.toThrow(NotFoundError);
    });
  });
});
