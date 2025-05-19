import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpStatus } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct = {
    id: 1,
    name: 'Product 1',
    description: 'Description 1',
    purchase_price: 50,
    selling_price: 100,
    stock: 10,
    category_id: 1,
    supplier_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockProductsService = {
    createProduct: jest.fn(),
    findAllProducts: jest.fn(),
    findProductById: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Description 1',
        purchase_price: 50,
        selling_price: 100,
        stock: 10,
        category_id: 1,
        supplier_id: 1,
      };

      const mockResponse = {
        status_code: HttpStatus.CREATED,
        success: true,
        data: mockProduct,
      };

      mockProductsService.createProduct.mockResolvedValue(mockResponse);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(mockResponse);
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: [mockProduct],
        pagination: {
          total_items: 1,
          total_pages: 1,
          current_page: 1,
          items_per_page: 10,
        },
      };

      mockProductsService.findAllProducts.mockResolvedValue(mockResponse);

      const result = await controller.findAll(1, 10);

      expect(result).toEqual(mockResponse);
      expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(1, 10, 'desc', undefined);
    });

    it('should return filtered products with search', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: [mockProduct],
        pagination: {
          total_items: 1,
          total_pages: 1,
          current_page: 1,
          items_per_page: 10,
        },
      };

      mockProductsService.findAllProducts.mockResolvedValue(mockResponse);

      const result = await controller.findAll(1, 10, 'desc', 'Product 1');

      expect(result).toEqual(mockResponse);
      expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(1, 10, 'desc', 'Product 1');
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: mockProduct,
      };

      mockProductsService.findProductById.mockResolvedValue(mockResponse);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockResponse);
      expect(mockProductsService.findProductById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        selling_price: 200,
      };

      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: { ...mockProduct, ...updateProductDto },
      };

      mockProductsService.updateProduct.mockResolvedValue(mockResponse);

      const result = await controller.update('1', updateProductDto);

      expect(result).toEqual(mockResponse);
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith(1, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: null,
      };

      mockProductsService.deleteProduct.mockResolvedValue(mockResponse);

      const result = await controller.remove('1');

      expect(result).toEqual(mockResponse);
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(1);
    });
  });
});
