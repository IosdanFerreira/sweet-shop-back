import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { HttpStatus } from '@nestjs/common';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategory = {
    id: 1,
    name: 'Test Category',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCategoryRepository = {
    insert: jest.fn(),
    findAll: jest.fn(),
    findAllFiltered: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    countAll: jest.fn(),
    countAllFiltered: jest.fn(),
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
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: 'CategoryRepositoryInterface',
          useValue: mockCategoryRepository,
        },
        {
          provide: 'PaginationInterface',
          useValue: mockPagination,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };

      mockCategoryRepository.insert.mockResolvedValue(mockCategory);

      const result = await controller.create(createCategoryDto);

      expect(result.status_code).toBe(HttpStatus.CREATED);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return paginated categories', async () => {
      mockCategoryRepository.findAll.mockResolvedValue([mockCategory]);
      mockCategoryRepository.countAll.mockResolvedValue(1);

      const result = await controller.findAll(1, 10);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockCategory]);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);

      const result = await controller.findOne('1');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCategory);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockCategoryRepository.update.mockResolvedValue(updatedCategory);

      const result = await controller.update('1', updateCategoryDto);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedCategory);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockCategoryRepository.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });
});
