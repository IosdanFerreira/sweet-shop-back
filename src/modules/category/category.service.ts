import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepositoryInterface } from './interfaces/category-repository.interface';
import { CategoryEntity } from './entities/category.entity';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryRepositoryInterface')
    private readonly categoryRepository: CategoryRepositoryInterface,

    @Inject('PaginationInterface')
    private readonly pagination: PaginationInterface,
  ) { }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<IDefaultResponse<CategoryEntity>> {
    const createdCategory = await this.categoryRepository.insert(createCategoryDto);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Categoria criada com sucesso',
      data: createdCategory,
      pagination: null,
    };

    return formattedReturn;
  }

  async findAllCategories(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<IDefaultResponse<CategoryEntity[]>> {
    if (search) {
      const filteredTotalItems = await this.categoryRepository.countAllFiltered(search);

      const filteredProducts = await this.categoryRepository.findAllFiltered(page, limit, orderBy, search);

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
    const categories = await this.categoryRepository.findAll(page, limit, orderBy);

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

  async findCategoryById(id: number): Promise<IDefaultResponse<CategoryEntity>> {
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

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<IDefaultResponse<CategoryEntity>> {
    await this._get(id);

    if (Object.keys(updateCategoryDto).length === 0) {
      throw new BadRequestError('Erro ao atualizar categoria', [
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    const updatedCategory = await this.categoryRepository.update(id, updateCategoryDto);

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

  protected async _get(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundError('Erro ao encontrar categoria', [
        {
          property: null,
          message: 'Categoria não encontrada',
        },
      ]);
    }

    return category;
  }
}
