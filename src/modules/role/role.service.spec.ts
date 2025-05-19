import { Test, TestingModule } from '@nestjs/testing';

import { APP_PIPE } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CreateRoleDto } from './dto/create-role.dto';
import { HttpStatus } from '@nestjs/common';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RemoveAccents } from 'src/shared/utils/remove-accents';
import { RoleEntity } from './entities/role.entity';
import { RoleRepository } from './repositories/role.repository';
import { RoleRepositoryInterface } from './interfaces/role-repository.interface';
import { RoleService } from './role.service';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { UpdateRoleDto } from './dto/update-role.dto';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';

describe('RoleService', () => {
  let service: RoleService;
  let mockRoleRepository: any;

  const mockRole: RoleEntity = {
    id: 1,
    name: 'Test Role',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    mockRoleRepository = {
      insert: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

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
          useValue: mockRoleRepository,
        },
        {
          provide: 'RemoveAccentsInterface',
          useClass: RemoveAccents,
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRole', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'Test Role',
      };

      mockRoleRepository.insert.mockResolvedValue(mockRole);

      const result = await service.createRole(createRoleDto);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockRole);
      expect(mockRoleRepository.insert).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('findAllRoles', () => {
    it('should return all roles', async () => {
      mockRoleRepository.findAll.mockResolvedValue([mockRole]);

      const result = await service.findAllRoles();

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockRole]);
      expect(mockRoleRepository.findAll).toHaveBeenCalledWith(null, null, null);
    });
  });

  describe('findRoleById', () => {
    it('should return a role by id', async () => {
      mockRoleRepository.findById.mockResolvedValue(mockRole);

      const result = await service.findRoleById(1);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockRole);
      expect(mockRoleRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when role is not found', async () => {
      mockRoleRepository.findById.mockResolvedValue(null);

      await expect(service.findRoleById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateRole', () => {
    it('should update a role', async () => {
      const updateRoleDto: UpdateRoleDto = {
        name: 'Updated Role',
      };

      const updatedRole = { ...mockRole, ...updateRoleDto };
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockRoleRepository.update.mockResolvedValue(updatedRole);

      const result = await service.updateRole(1, updateRoleDto);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedRole);
      expect(mockRoleRepository.update).toHaveBeenCalledWith(1, updateRoleDto);
    });

    it('should throw NotFoundError when role is not found', async () => {
      mockRoleRepository.findById.mockResolvedValue(null);

      await expect(service.updateRole(999, { name: 'Updated' })).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError when no update data is provided', async () => {
      mockRoleRepository.findById.mockResolvedValue(mockRole);

      await expect(service.updateRole(1, {})).rejects.toThrow(BadRequestError);
    });
  });

  describe('deleteRole', () => {
    it('should remove a role', async () => {
      mockRoleRepository.findById.mockResolvedValue(mockRole);
      mockRoleRepository.remove.mockResolvedValue(undefined);

      const result = await service.deleteRole(1);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(mockRoleRepository.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when role is not found', async () => {
      mockRoleRepository.findById.mockResolvedValue(null);

      await expect(service.deleteRole(999)).rejects.toThrow(NotFoundError);
    });
  });
});
