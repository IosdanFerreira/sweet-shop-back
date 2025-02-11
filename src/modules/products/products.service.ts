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

  async createProduct(createProductDto: CreateProductDto): Promise<IDefaultResponse<ProductEntity>> {
    await this.categoryService.findCategoryById(createProductDto.category_id);

    await this.supplierService.findSupplierById(createProductDto.supplier_id);

    const createdProduct = await this.productRepository.insert(createProductDto);

    const formattedReturn = {
      status_code: HttpStatus.CREATED,
      success: true,
      error_type: null,
      errors: null,
      message: 'Produto criado com sucesso',
      data: { ...createdProduct },
      pagination: null,
    };

    return formattedReturn;
  }

  async findAllProducts(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<IDefaultResponse<ProductEntity[]>> {
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

  async findProductById(id: number): Promise<IDefaultResponse<ProductEntity>> {
    const product = await this._get(id);

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

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<IDefaultResponse<ProductEntity>> {
    await this._get(id);

    if (Object.keys(updateProductDto).length === 0) {
      throw new BadRequestError([
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    const updatedProduct = await this.productRepository.update(id, updateProductDto);

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

  async deleteProduct(id: number): Promise<IDefaultResponse<null>> {
    await this._get(id);

    await this.productRepository.remove(id);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Produto excluído com sucesso',
      data: null,
      pagination: null,
    };

    return formattedReturn;
  }

  protected async _get(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundError([
        {
          property: null,
          message: 'Produto não encontrado',
        },
      ]);
    }

    return product;
  }
}
