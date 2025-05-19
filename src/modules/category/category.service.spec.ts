import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { HttpStatus } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockCategoryRepository: any;
  let mockPagination: any;

  const mockCategory: CategoryEntity = {
    id: 1,
    name: 'Test Category',
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
    mockCategoryRepository = {
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

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };

      mockCategoryRepository.insert.mockResolvedValue(mockCategory);

      const result = await service.createCategory(createCategoryDto);

      expect(result.status_code).toBe(HttpStatus.CREATED);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCategory);
      expect(mockCategoryRepository.insert).toHaveBeenCalledWith(createCategoryDto);
    });
  });

  describe('findAllCategories', () => {
    it('should return paginated categories', async () => {
      mockCategoryRepository.findAll.mockResolvedValue([mockCategory]);
      mockCategoryRepository.countAll.mockResolvedValue(1);

      const result = await service.findAllCategories(1, 10);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockCategory]);
      expect(result.pagination).toEqual(mockPaginationResult);
    });

    it('should return filtered categories with search', async () => {
      mockCategoryRepository.findAllFiltered.mockResolvedValue([mockCategory]);
      mockCategoryRepository.countAllFiltered.mockResolvedValue(1);

      const result = await service.findAllCategories(1, 10, 'desc', 'test');

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockCategory]);
      expect(result.pagination).toEqual(mockPaginationResult);
      expect(mockCategoryRepository.findAllFiltered).toHaveBeenCalledWith(1, 10, 'desc', 'test');
      expect(mockCategoryRepository.countAllFiltered).toHaveBeenCalledWith('test');
    });
  });

  describe('findCategoryById', () => {
    it('should return a category by id', async () => {
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);

      const result = await service.findCategoryById(1);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCategory);
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when category is not found', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(service.findCategoryById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      const updatedCategory = { ...mockCategory, ...updateCategoryDto };
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockCategoryRepository.update.mockResolvedValue(updatedCategory);

      const result = await service.updateCategory(1, updateCategoryDto);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedCategory);
      expect(mockCategoryRepository.update).toHaveBeenCalledWith(1, updateCategoryDto);
    });

    it('should throw NotFoundError when category is not found', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(service.updateCategory(999, { name: 'Updated' })).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError when no update data is provided', async () => {
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);

      await expect(service.updateCategory(1, {})).rejects.toThrow(BadRequestError);
    });
  });

  describe('deleteCategory', () => {
    it('should remove a category', async () => {
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockCategoryRepository.remove.mockResolvedValue(undefined);

      const result = await service.deleteCategory(1);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(mockCategoryRepository.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when category is not found', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(service.deleteCategory(999)).rejects.toThrow(NotFoundError);
    });
  });
});
