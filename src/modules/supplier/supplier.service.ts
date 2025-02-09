import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierRepositoryInterface } from './interfaces/supplier-repository.interface';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { Supplier } from './entities/supplier.entity';
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
  async createSupplier(createSupplierDto: CreateSupplierDto): Promise<IDefaultResponse<Supplier>> {
    const createdSupplier = await this.supplierRepository.insert(createSupplierDto);

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

  async findAllSuppliers(page: number, limit: number, orderBy: 'asc' | 'desc' = 'desc', search?: string) {
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

  async findSupplierById(id: number): Promise<IDefaultResponse<Supplier>> {
    const supplier = await this._get(id);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Fornecedor encontrado',
      data: supplier,
      pagination: null,
    };

    return formattedReturn;
  }

  async updateSupplier(id: number, updateSupplierDto: UpdateSupplierDto): Promise<IDefaultResponse<Supplier>> {
    await this._get(id);

    if (Object.keys(updateSupplierDto).length === 0) {
      throw new BadRequestError([
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    const updatedSupplier = await this.supplierRepository.update(id, updateSupplierDto);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Fornecedor atualizado com sucesso',
      data: updatedSupplier,
      pagination: null,
    };

    return formattedReturn;
  }

  async deleteSupplier(id: number): Promise<IDefaultResponse<null>> {
    await this._get(id);

    await this.supplierRepository.remove(id);

    const formattedReturn = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Fornecedor excluído com sucesso',
      data: null,
      pagination: null,
    };

    return formattedReturn;
  }

  protected async _get(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id);

    if (!supplier) {
      throw new NotFoundError([
        {
          property: null,
          message: 'Fornecedor nao encontrado',
        },
      ]);
    }

    return supplier;
  }
}
