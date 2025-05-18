import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepositoryInterface } from './interfaces/role-repository.interface';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { RoleEntity } from './entities/role.entity';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';

@Injectable()
export class RoleService {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  /**
   * Create a new role in the database.
   *
   * @param createRoleDto The CreateRoleDto object with the role information.
   * @returns A Promise that resolves with a IDefaultResponse<RoleEntity> object.
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<IDefaultResponse<RoleEntity>> {
    const createdRole = await this.roleRepository.insert(createRoleDto);

    const formattedRole: IDefaultResponse<RoleEntity> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Permissão criada com sucesso',
      data: createdRole,
      pagination: null,
    };

    return formattedRole;
  }

  /**
   * Get all roles from the database.
   *
   * @returns A Promise that resolves with a IDefaultResponse<RoleEntity[]> object.
   */
  async findAllRoles(): Promise<IDefaultResponse<RoleEntity[]>> {
    const roles = await this.roleRepository.findAll(null, null, null);

    const formattedRoles: IDefaultResponse<RoleEntity[]> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Permissões encontradas',
      data: roles,
      pagination: null,
    };

    return formattedRoles;
  }

  /**
   * Get a role by its ID.
   *
   * @param id The ID of the role to get.
   * @returns A Promise that resolves with a IDefaultResponse<RoleEntity> object.
   */
  async findRoleById(id: number): Promise<IDefaultResponse<RoleEntity>> {
    const foundedRole = await this._get(id);

    // Format the response with the founded role
    const formattedRole: IDefaultResponse<RoleEntity> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Permissão encontrada',
      data: foundedRole,
      pagination: null,
    };

    return formattedRole;
  }

  /**
   * Update a role by its ID.
   *
   * @param id The ID of the role to update.
   * @param updateRoleDto The data to update the role with.
   * @returns A Promise that resolves with a IDefaultResponse<RoleEntity> object.
   */
  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<IDefaultResponse<RoleEntity>> {
    // Retrieve the role to ensure it exists
    await this._get(id);

    // Check if there is any data to update
    if (Object.keys(updateRoleDto).length === 0) {
      // If no data is provided, throw an error
      throw new BadRequestError('Erro ao atualizar permissão', [
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    // Update the role
    const updatedRole = await this.roleRepository.update(id, updateRoleDto);

    // Format the response with the updated role
    const formattedRole: IDefaultResponse<RoleEntity> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Permissão atualizada com sucesso',
      data: updatedRole,
      pagination: null,
    };

    return formattedRole;
  }

  /**
   * Deletes a role by its ID and returns a formatted response.
   * @param id - The ID of the role to delete.
   * @returns A promise with the formatted response indicating success.
   */
  async deleteRole(id: number): Promise<IDefaultResponse<null>> {
    // Retrieve the role to ensure it exists
    await this._get(id);

    // Remove the role from the repository
    await this.roleRepository.remove(id);

    // Format the successful deletion response
    const formattedRole: IDefaultResponse<null> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Permissão excluída com sucesso',
      data: null,
      pagination: null,
    };

    // Return the formatted response
    return formattedRole;
  }

  /**
   * Internal method to get a role by its ID.
   * @param id - The ID of the role to get.
   * @throws NotFoundError if the role is not found.
   * @returns A promise with the role entity.
   */
  protected async _get(id: number): Promise<RoleEntity> {
    // Retrieve the role from the repository
    const role = await this.roleRepository.findById(id);

    // If the role is not found, throw a NotFoundError
    if (!role) {
      throw new NotFoundError('Erro ao buscar permissão', [
        {
          property: null,
          message: 'Permissão não encontrada',
        },
      ]);
    }

    // Return the role entity
    return role;
  }
}
