import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierRepositoryInterface } from './interfaces/supplier-repository.interface';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { SupplierEntity } from './entities/supplier.entity';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';

@Injectable()
export class SupplierService {
  constructor(
    @Inject('SupplierRepositoryInterface')
    private readonly supplierRepository: SupplierRepositoryInterface,

    @Inject('PaginationInterface')
    private readonly pagination: PaginationInterface,
  ) {}

  /**
   * Create a new supplier.
   *
   * @param {CreateSupplierDto} createSupplierDto The data to create a new supplier.
   * @returns {Promise<IDefaultResponse<SupplierEntity>>} The created supplier.
   */
  async createSupplier(createSupplierDto: CreateSupplierDto): Promise<IDefaultResponse<SupplierEntity>> {
    // Insert the new supplier into the database using the repository.
    const createdSupplier = await this.supplierRepository.insert(createSupplierDto);

    // Return a formatted response with the created supplier.
    const formattedReturn = {
      status_code: HttpStatus.CREATED,
      success: true,
      error_type: null,
      errors: null,
      message: 'Fornecedor criado com sucesso',
      data: createdSupplier,
      pagination: null,
    };

    return formattedReturn;
  }

  /**
   * Get all suppliers.
   *
   * @param {number} page The page to search.
   * @param {number} limit The limit of items per page.
   * @param {string} orderBy The order to sort the suppliers. It can be 'asc' or 'desc'.
   * @param {string} search The search query to search in the suppliers.
   * @returns {Promise<IDefaultResponse<SupplierEntity[]>>} A promise with the response.
   */
  async findAllSuppliers(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    search?: string,
  ): Promise<IDefaultResponse<SupplierEntity[]>> {
    // If the search query is provided, filter the suppliers
    if (search) {
      const filteredTotalItems = await this.supplierRepository.countAllFiltered(search);

      const filteredSuppliers = await this.supplierRepository.findAllFiltered(page, limit, orderBy, search);

      const formattedReturn = {
        status_code: HttpStatus.OK,
        success: true,
        error_type: null,
        errors: null,
        message: 'Fornecedores encontrados com sucesso',
        data: filteredSuppliers,
        pagination: this.pagination.generate(filteredTotalItems, page, limit),
      };

      return formattedReturn;
    }

    // If not, get all suppliers
    const totalItems = await this.supplierRepository.countAll();

    const allSuppliers = await this.supplierRepository.findAll(page, limit, orderBy);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Fornecedores encontrados com sucesso',
      data: allSuppliers,
      pagination: this.pagination.generate(totalItems, page, limit),
    };

    return formattedReturn;
  }

  /**
   * Get a supplier by id.
   *
   * @param {number} id The id of the supplier to get.
   * @returns {Promise<IDefaultResponse<SupplierEntity>>} A promise with the response.
   */
  async findSupplierById(id: number): Promise<IDefaultResponse<SupplierEntity>> {
    // Get the supplier by id
    const supplier = await this._get(id);

    // Format the response
    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Fornecedor encontrado',
      data: supplier,
      pagination: null,
    };

    // Return the response
    return formattedReturn;
  }

  /**
   * Updates a supplier by their ID and returns a formatted response.
   *
   * @param {number} id The ID of the supplier to update.
   * @param {UpdateSupplierDto} updateSupplierDto The data to update the supplier with.
   * @returns {Promise<IDefaultResponse<SupplierEntity>>} A promise with the formatted response indicating success.
   */
  async updateSupplier(id: number, updateSupplierDto: UpdateSupplierDto): Promise<IDefaultResponse<SupplierEntity>> {
    // Retrieve the supplier to ensure they exist
    await this._get(id);

    // Check if there is any data to update
    if (Object.keys(updateSupplierDto).length === 0) {
      // If no data is provided, throw an error
      throw new BadRequestError('Erro ao atualizar dados do fornecedor', [
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    // Update the supplier
    const updatedSupplier = await this.supplierRepository.update(id, updateSupplierDto);

    // Format the response
    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Fornecedor atualizado com sucesso',
      data: updatedSupplier,
      pagination: null,
    };

    // Return the formatted response
    return formattedReturn;
  }

  /**
   * Deletes a supplier by their ID and returns a formatted response.
   *
   * @param {number} id The ID of the supplier to delete.
   * @returns {Promise<IDefaultResponse<null>>} A promise with the formatted response indicating success.
   */
  async deleteSupplier(id: number): Promise<IDefaultResponse<null>> {
    // Retrieve the supplier to ensure they exist
    await this._get(id);

    // Remove the supplier from the repository
    await this.supplierRepository.remove(id);

    // Format the successful deletion response
    const formattedReturn: IDefaultResponse<null> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Fornecedor excluído com sucesso',
      data: null,
      pagination: null,
    };

    // Return the formatted response
    return formattedReturn;
  }

  /**
   * Retrieves a supplier by their ID.
   *
   * @param {number} id - The ID of the supplier to retrieve.
   * @returns {Promise<SupplierEntity>} A promise that resolves to the supplier entity.
   * @throws {NotFoundError} If the supplier is not found.
   */
  protected async _get(id: number): Promise<SupplierEntity> {
    // Attempt to find the supplier by ID
    const supplier = await this.supplierRepository.findById(id);

    // If no supplier is found, throw a NotFoundError
    if (!supplier) {
      throw new NotFoundError('Erro ao buscar dados do fornecedor', [
        {
          property: null,
          message: 'Fornecedor nao encontrado',
        },
      ]);
    }

    // Return the found supplier entity
    return supplier;
  }
}
