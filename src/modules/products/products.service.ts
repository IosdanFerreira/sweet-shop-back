import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepositoryInterface } from './interfaces/product-repository.interface';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { CategoryService } from '../category/category.service';
import { SupplierService } from '../supplier/supplier.service';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('ProductRepositoryInterface')
    private readonly productRepository: ProductRepositoryInterface,

    @Inject('PaginationInterface')
    private readonly pagination: PaginationInterface,

    private readonly categoryService: CategoryService,
    private readonly supplierService: SupplierService,
  ) {}

  /**
   * Create a new product.
   *
   * @param {CreateProductDto} createProductDto The data to create a new product.
   * @returns {Promise<IDefaultResponse<ProductEntity>>} The created product.
   */
  async createProduct(createProductDto: CreateProductDto): Promise<IDefaultResponse<ProductEntity>> {
    // Verify if the category exists
    await this.categoryService.findCategoryById(createProductDto.category_id);

    // Verify if the supplier exists
    await this.supplierService.findSupplierById(createProductDto.supplier_id);

    // Insert the new product into the database using the repository.
    const createdProduct = await this.productRepository.insert(createProductDto);

    // Return a formatted response with the created product.
    const formattedReturn = {
      status_code: HttpStatus.CREATED,
      success: true,
      error_type: null,
      errors: null,
      message: 'Produto criado com sucesso',
      data: createdProduct,
      pagination: null,
    };

    return formattedReturn;
  }

  /**
   * Finds all products, using the given filters.
   *
   * @param {number} page The page of the pagination.
   * @param {number} limit The limit of items per page.
   * @param {string} orderBy The order of the items, either 'asc' or 'desc'.
   * @param {string} search The search query to filter the products.
   * @returns {Promise<IDefaultResponse<ProductEntity[]>>} A promise with the list of products and a default response.
   */
  async findAllProducts(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<IDefaultResponse<ProductEntity[]>> {
    // If the search query is provided, filter the products
    if (search) {
      const filteredTotalItems = await this.productRepository.countAllFiltered(search);
      const filteredProducts = await this.productRepository.findAllFiltered(page, limit, orderBy, search);

      const formattedReturn = {
        status_code: HttpStatus.OK,
        success: true,
        error_type: null,
        errors: null,
        message: 'Produtos encontrados com sucesso',
        data: filteredProducts,
        pagination: this.pagination.generate(filteredTotalItems, page, limit),
      };

      return formattedReturn;
    }

    // If not, get all products
    const totalItems = await this.productRepository.countAll();
    const products = await this.productRepository.findAll(page, limit, orderBy);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Produtos encontrados com sucesso',
      data: products,
      pagination: this.pagination.generate(totalItems, page, limit),
    };

    return formattedReturn;
  }

  /**
   * Finds a product by its ID.
   *
   * @param {number} id The ID of the product to find.
   * @returns {Promise<IDefaultResponse<ProductEntity>>} A promise with the product entity and a default response.
   */
  async findProductById(id: number): Promise<IDefaultResponse<ProductEntity>> {
    // Get the product by its ID
    const product = await this._get(id);

    // Format the return
    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Produto encontrado com sucesso',
      data: product,
      pagination: null,
    };

    return formattedReturn;
  }

  /**
   * Updates a product by its ID.
   *
   * @param {number} id The ID of the product to update.
   * @param {UpdateProductDto} updateProductDto The data to update the product with.
   * @returns {Promise<IDefaultResponse<ProductEntity>>} A promise with the updated product and a default response.
   */
  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<IDefaultResponse<ProductEntity>> {
    // Verify if the product exists
    await this._get(id);

    // Check if there is any data to update
    if (Object.keys(updateProductDto).length === 0) {
      // If no data is provided, throw an error
      throw new BadRequestError('Erro ao atualizar produto', [
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    // Update the product
    const updatedProduct = await this.productRepository.update(id, updateProductDto);

    // Format the response
    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Produto atualizado com sucesso',
      data: updatedProduct,
      pagination: null,
    };

    return formattedReturn;
  }

  /**
   * Deletes a product by its ID and returns a formatted response.
   *
   * @param {number} id - The ID of the product to delete.
   * @returns {Promise<IDefaultResponse<null>>} A promise with the formatted response indicating success.
   */
  async deleteProduct(id: number): Promise<IDefaultResponse<null>> {
    // Retrieve the product to ensure it exists
    await this._get(id);

    // Remove the product from the repository
    await this.productRepository.remove(id);

    // Format the successful deletion response
    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Produto excluído com sucesso',
      data: null,
      pagination: null,
    };

    // Return the formatted response
    return formattedReturn;
  }

  /**
   * Retrieves a product by its ID.
   *
   * @param {number} id - The ID of the product to retrieve.
   * @returns {Promise<ProductEntity>} A promise that resolves to the product entity.
   * @throws {NotFoundError} If the product is not found.
   */
  protected async _get(id: number): Promise<ProductEntity> {
    // Attempt to find the product by ID
    const product = await this.productRepository.findById(id);

    // If the product is not found, throw a NotFoundError
    if (!product) {
      throw new NotFoundError('Erro a buscar produto', [
        {
          property: null,
          message: 'Produto não encontrado',
        },
      ]);
    }

    // Return the found product entity
    return product;
  }
}
