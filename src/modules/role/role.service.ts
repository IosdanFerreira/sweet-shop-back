import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepositoryInterface } from './interfaces/role-repository.interface';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { Role } from './entities/role.entity';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';

@Injectable()
export class RoleService {
  constructor(
    @Inject('RoleRepositoryInterface')
    private readonly roleRepository: RoleRepositoryInterface,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<IDefaultResponse<Role>> {
    const createdRole = await this.roleRepository.insert(createRoleDto);

    const formattedRole = {
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

  async findAllRoles(): Promise<IDefaultResponse<Role[]>> {
    const roles = await this.roleRepository.findAll(null, null, null);

    const formattedRoles = {
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

  async findRoleById(id: number): Promise<IDefaultResponse<Role>> {
    const foundedRole = await this._get(id);

    const formattedRole = {
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

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<IDefaultResponse<Role>> {
    await this._get(id);

    if (Object.keys(updateRoleDto).length === 0) {
      throw new BadRequestError([
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    const updatedRole = await this.roleRepository.update(id, updateRoleDto);

    const formattedRole = {
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

  async deleteRole(id: number): Promise<IDefaultResponse<null>> {
    await this._get(id);

    await this.roleRepository.remove(id);

    const formattedRole = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Permissão excluída com sucesso',
      data: null,
      pagination: null,
    };

    return formattedRole;
  }

  protected async _get(id: number): Promise<Role> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new NotFoundError([
        {
          property: null,
          message: 'Permissão não encontrada',
        },
      ]);
    }

    return role;
  }
}
