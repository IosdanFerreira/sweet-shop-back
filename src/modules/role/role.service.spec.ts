import { Test, TestingModule } from '@nestjs/testing';

import { APP_PIPE } from '@nestjs/core';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { ConfigService } from '@nestjs/config';
import { CreateRoleDto } from './dto/create-role.dto';
import { HttpStatus } from '@nestjs/common';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { PaginationInterface } from 'src/shared/interfaces/pagination.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { RemoveAccents } from 'src/shared/utils/remove-accents';
import { RoleEntity } from './entities/role.entity';
import { RoleRepository } from './repositories/role.repository';
import { RoleRepositoryInterface } from './interfaces/role-repository.interface';
import { RoleService } from './role.service';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepository: RoleRepositoryInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        RoleService,
        PrismaService,
        {
          provide: APP_PIPE,
          useValue: { transform: jest.fn() },
        },
        {
          provide: 'RoleServiceInterface',
          useClass: RoleService,
        },
        {
          provide: 'RoleRepositoryInterface',
          useClass: RoleRepository,
        },
        {
          provide: 'RemoveAccentsInterface',
          useClass: RemoveAccents,
        },
        ConfigService,
      ],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
    roleRepository = module.get<RoleRepositoryInterface>('RoleRepositoryInterface');
  });

  it('should create a new role successfully', async () => {
    const createRoleDto: CreateRoleDto = { name: 'Test Role' };
    const createdRole: RoleEntity = { id: 1, name: 'Test Role', created_at: new Date(), updated_at: new Date() };

    jest.spyOn(roleRepository, 'insert').mockResolvedValueOnce(createdRole);

    const result: IDefaultResponse<RoleEntity> = await roleService.createRole(createRoleDto);

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Permissão criada com sucesso');
    expect(result.data).toEqual(createdRole);
  });

  it('should throw an error when role repository insert fails', async () => {
    const createRoleDto: CreateRoleDto = { name: 'Test Role' };

    jest.spyOn(roleRepository, 'insert').mockRejectedValueOnce(new Error('Insert failed'));

    await expect(roleService.createRole(createRoleDto)).rejects.toThrowError();
  });

  it('should return successful response with roles', async () => {
    const roles: RoleEntity[] = [{ id: 1, name: 'Admin', created_at: new Date(), updated_at: new Date() }];
    jest.spyOn(roleRepository, 'findAll').mockResolvedValue(roles);

    const result = await roleService.findAllRoles();

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(roles);
  });

  it('should return successful response with empty roles array', async () => {
    jest.spyOn(roleRepository, 'findAll').mockResolvedValue([]);

    const result = await roleService.findAllRoles();

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('should throw error if role repository throws error', async () => {
    jest.spyOn(roleRepository, 'findAll').mockRejectedValue(new Error('Test error'));

    await expect(roleService.findAllRoles()).rejects.toThrowError('Test error');
  });

  it('should return a role when the ID is valid', async () => {
    const id = 1;
    const role = { id: 1, name: 'Admin', created_at: new Date(), updated_at: new Date() };
    jest.spyOn(roleRepository, 'findById').mockResolvedValueOnce(role);

    const result = await roleService.findRoleById(id);
    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toBe(role);
  });

  it('should throw an error when the ID is invalid', async () => {
    const id = 1;
    jest.spyOn(roleRepository, 'findById').mockResolvedValueOnce(null);

    await expect(roleService.findRoleById(id)).rejects.toThrow(NotFoundError);
  });

  it('should return the correct status code and message when the role is found', async () => {
    const id = 1;
    const role = new RoleEntity();
    jest.spyOn(roleRepository, 'findById').mockResolvedValueOnce(role);

    const result = await roleService.findRoleById(id);
    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.message).toBe('Permissão encontrada');
  });

  it('should update role with valid data', async () => {
    const id = 1;
    const updateRoleDto: UpdateRoleDto = { name: 'New Role' };
    const updatedRole: RoleEntity = {
      id,
      name: 'New Role',
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest
      .spyOn(roleRepository, 'findById')
      .mockResolvedValueOnce({ id, name: 'Old Role', created_at: new Date(), updated_at: new Date() });

    jest.spyOn(roleRepository, 'update').mockResolvedValueOnce(updatedRole);

    const result = await roleService.updateRole(id, updateRoleDto);

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.data).toBe(updatedRole);
  });

  it('should throw error with empty update data', async () => {
    const id = 1;
    const updateRoleDto: UpdateRoleDto = {};

    await expect(roleService.updateRole(id, updateRoleDto)).rejects.toThrow(
      "Cannot read properties of undefined (reading 'role')",
    );
  });

  it('should throw error with non-existent role ID', async () => {
    const id = 1;
    const updateRoleDto: UpdateRoleDto = { name: 'New Role' };

    jest.spyOn(roleRepository, 'findById').mockResolvedValueOnce(null);

    await expect(roleService.updateRole(id, updateRoleDto)).rejects.toThrow(
      new NotFoundError([
        {
          property: null,
          message: 'Permissão não encontrada',
        },
      ]),
    );
  });

  it('should delete a role successfully', async () => {
    const id = 1;
    const role = new RoleEntity();
    role.id = id;

    jest.spyOn(roleRepository, 'findById').mockResolvedValueOnce(role);
    jest.spyOn(roleRepository, 'remove').mockResolvedValueOnce();

    const result = await roleService.deleteRole(id);

    expect(result.status_code).toBe(HttpStatus.OK);
    expect(result.success).toBe(true);
    expect(result.message).toBe('Permissão excluída com sucesso');
  });

  it('should throw NotFoundError when role is not found', async () => {
    const id = 1;

    jest.spyOn(roleRepository, 'findById').mockResolvedValueOnce(null);

    try {
      await roleService.deleteRole(id);
      fail('Expected NotFoundError to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
    }
  });

  it('should throw error when removing role from repository fails', async () => {
    const id = 1;
    const role = new RoleEntity();
    role.id = id;

    jest.spyOn(roleRepository, 'findById').mockResolvedValueOnce(role);
    jest.spyOn(roleRepository, 'remove').mockRejectedValueOnce(new Error('Error removing role'));

    try {
      await roleService.deleteRole(id);
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
