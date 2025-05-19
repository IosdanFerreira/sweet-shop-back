import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { HttpStatus } from '@nestjs/common';

describe('RoleController', () => {
  let controller: RoleController;
  let service: RoleService;

  const mockRole = {
    id: 1,
    name: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockRoleService = {
    createRole: jest.fn(),
    findAllRoles: jest.fn(),
    findRoleById: jest.fn(),
    updateRole: jest.fn(),
    deleteRole: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
      };

      const mockResponse = {
        status_code: HttpStatus.CREATED,
        success: true,
        data: mockRole,
      };

      mockRoleService.createRole.mockResolvedValue(mockResponse);

      const result = await controller.create(createRoleDto);

      expect(result).toEqual(mockResponse);
      expect(mockRoleService.createRole).toHaveBeenCalledWith(createRoleDto);
    });
  });

  describe('findAll', () => {
    it('should return all roles', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: [mockRole],
      };

      mockRoleService.findAllRoles.mockResolvedValue(mockResponse);

      const result = await controller.findAll();

      expect(result).toEqual(mockResponse);
      expect(mockRoleService.findAllRoles).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: mockRole,
      };

      mockRoleService.findRoleById.mockResolvedValue(mockResponse);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockResponse);
      expect(mockRoleService.findRoleById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const updateRoleDto: UpdateRoleDto = {
        name: 'super_admin',
      };

      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: { ...mockRole, ...updateRoleDto },
      };

      mockRoleService.updateRole.mockResolvedValue(mockResponse);

      const result = await controller.update('1', updateRoleDto);

      expect(result).toEqual(mockResponse);
      expect(mockRoleService.updateRole).toHaveBeenCalledWith(1, updateRoleDto);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: null,
      };

      mockRoleService.deleteRole.mockResolvedValue(mockResponse);

      const result = await controller.remove('1');

      expect(result).toEqual(mockResponse);
      expect(mockRoleService.deleteRole).toHaveBeenCalledWith(1);
    });
  });
});
