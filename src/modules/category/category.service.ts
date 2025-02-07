import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepositoryInterface } from './interfaces/category-repository.interface';
import { Category } from './entities/category.entity';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,

    @Inject('PaginationInterface')
    private readonly pagination: PaginationInterface,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<IDefaultResponse<Category>> {
    const createdCategory =
      await this.categoryRepository.insert(createCategoryDto);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Categoria criada com sucesso',
      data: { ...createdCategory },
      pagination: null,
    };

    return formattedReturn;
  }

  async findAllCategories(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<IDefaultResponse<Category[]>> {
    if (search) {
      const filteredTotalItems =
        await this.categoryRepository.countAllFiltered(search);

      const filteredProducts = await this.categoryRepository.findAllFiltered(
        page,
        limit,
        orderBy,
        search,
      );

      const formattedReturn = {
        status_code: HttpStatus.OK,
        success: true,
        error_type: null,
        errors: null,
        message: 'Categorias encontradas com sucesso',
        data: filteredProducts,
        pagination: this.pagination.generate(filteredTotalItems, page, limit),
      };

      return formattedReturn;
    }

    const totalItems = await this.categoryRepository.countAll();
    const categories = await this.categoryRepository.findAll(
      page,
      limit,
      orderBy,
    );

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Categorias encontradas com sucesso',
      data: categories,
      pagination: this.pagination.generate(totalItems, page, limit),
    };

    return formattedReturn;
  }

  async findCategoryById(id: number): Promise<Category> {
    const categoryAlreadyExist = await this._get(id);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Categoria encontrada com sucesso',
      data: categoryAlreadyExist,
      pagination: null,
    };

    return formattedReturn;
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this._get(id);

    const updatedCategory = await this.categoryRepository.update(
      id,
      updateCategoryDto,
    );

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Categoria atualizada com sucesso',
      data: updatedCategory,
      pagination: null,
    };

    return formattedReturn;
  }

  async deleteCategory(id: number): Promise<IDefaultResponse<null>> {
    await this._get(id);

    await this.categoryRepository.remove(id);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Categoria excluída com sucesso',
      data: null,
      pagination: null,
    };

    return formattedReturn;
  }

  protected async _get(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError([
        {
          property: null,
          message: 'Categoria não encontrada',
        },
      ]);
    }

    return category;
  }
}
