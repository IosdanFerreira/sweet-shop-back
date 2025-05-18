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
  ) {}

  /**
   * Creates a new category.
   *
   * @param {CreateCategoryDto} createCategoryDto - The data to create a new category.
   * @returns {Promise<IDefaultResponse<CategoryEntity>>} The created category.
   */
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<IDefaultResponse<CategoryEntity>> {
    // Insert the new category into the database using the repository.
    const createdCategory = await this.categoryRepository.insert(createCategoryDto);

    // Return a formatted response with the created category.
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

  /**
   * Finds all categories, using the given filters.
   *
   * @param {number} page The page of the pagination.
   * @param {number} limit The limit of items per page.
   * @param {string} orderBy The order of the items, either 'asc' or 'desc'.
   * @param {string} search The search query to filter the products.
   * @returns {Promise<IDefaultResponse<CategoryEntity[]>>} A promise with the list of categories and a default response.
   */
  async findAllCategories(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<IDefaultResponse<CategoryEntity[]>> {
    // If the search query is provided, filter the categories
    if (search) {
      const filteredTotalItems = await this.categoryRepository.countAllFiltered(search);

      const filteredCategories = await this.categoryRepository.findAllFiltered(page, limit, orderBy, search);

      const formattedReturn = {
        status_code: HttpStatus.OK,
        success: true,
        error_type: null,
        errors: null,
        message: 'Categorias encontradas com sucesso',
        data: filteredCategories,
        pagination: this.pagination.generate(filteredTotalItems, page, limit),
      };

      return formattedReturn;
    }

    // If not, get all categories
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

  /**
   * Finds a category by its ID.
   *
   * @param {number} id The ID of the category to find.
   * @returns {Promise<IDefaultResponse<CategoryEntity>>} A promise with the category entity and a default response.
   */
  async findCategoryById(id: number): Promise<IDefaultResponse<CategoryEntity>> {
    // Retrieve the category to ensure it exists
    const categoryAlreadyExist = await this._get(id);

    // Format the response with the category
    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Categoria encontrada com sucesso',
      data: categoryAlreadyExist,
      pagination: null,
    };

    // Return the formatted response
    return formattedReturn;
  }

  /**
   * Updates a category by its ID.
   *
   * @param {number} id The ID of the category to update.
   * @param {UpdateCategoryDto} updateCategoryDto The data to update the category with.
   * @returns {Promise<IDefaultResponse<CategoryEntity>>} A promise with the updated category and a default response.
   */
  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<IDefaultResponse<CategoryEntity>> {
    // Retrieve the category to ensure it exists
    await this._get(id);

    // Check if there is any data to update
    if (Object.keys(updateCategoryDto).length === 0) {
      // If no data is provided, throw an error
      throw new BadRequestError('Erro ao atualizar categoria', [
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    // Update the category
    const updatedCategory = await this.categoryRepository.update(id, updateCategoryDto);

    // Format the response with the updated category
    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Categoria atualizada com sucesso',
      data: updatedCategory,
      pagination: null,
    };

    // Return the formatted response
    return formattedReturn;
  }

  /**
   * Deletes a category by its ID and returns a formatted response.
   *
   * @param {number} id The ID of the category to delete.
   * @returns {Promise<IDefaultResponse<null>>} A promise with the formatted response indicating success.
   */
  async deleteCategory(id: number): Promise<IDefaultResponse<null>> {
    // Retrieve the category to ensure it exists
    await this._get(id);

    // Remove the category from the repository
    await this.categoryRepository.remove(id);

    // Format the successful deletion response
    const formattedReturn: IDefaultResponse<null> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Categoria excluída com sucesso',
      data: null,
      pagination: null,
    };

    // Return the formatted response
    return formattedReturn;
  }

  /**
   * Retrieves a category by its ID.
   *
   * @param {number} id - The ID of the category to retrieve.
   * @returns {Promise<CategoryEntity>} A promise that resolves to the category entity.
   * @throws {NotFoundError} If the category is not found.
   */
  protected async _get(id: number): Promise<CategoryEntity> {
    // Attempt to find the category by ID
    const category = await this.categoryRepository.findById(id);

    // If the category is not found, throw a NotFoundError
    if (!category) {
      throw new NotFoundError('Erro ao encontrar categoria', [
        {
          property: null,
          message: 'Categoria não encontrada',
        },
      ]);
    }

    // Return the found category entity
    return category;
  }
}
