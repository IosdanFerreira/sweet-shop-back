import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { HttpStatus } from '@nestjs/common';
import { RoleEntity } from 'src/modules/role/entities/role.entity';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: any;

  const mockRole: RoleEntity = {
    id: 1,
    name: 'Test Role',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUser: UserEntity = {
    id: 1,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@user.com',
    phone: '12345678901',
    address: 'Test Address',
    privacy_consent: true,
    role: mockRole,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'UserRepositoryInterface',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await service.getUserById(1);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.getUserById(999)).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'Updated',
        last_name: 'User',
        email: 'updated@user.com',
        phone: '98765432101',
        address: 'Updated Address',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.updateUser(1, updateUserDto);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should throw NotFoundError when user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const updateUserDto: UpdateUserDto = {
        first_name: 'Updated',
        last_name: 'User',
        email: 'updated@user.com',
        phone: '98765432101',
        address: 'Updated Address',
      };

      await expect(service.updateUser(999, updateUserDto)).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError when no update data is provided', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const emptyUpdateUserDto = new UpdateUserDto();
      await expect(service.updateUser(1, emptyUpdateUserDto)).rejects.toThrow(BadRequestError);
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should remove a user', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(undefined);

      const result = await service.deleteUser(1);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(mockUserRepository.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.deleteUser(999)).rejects.toThrow(NotFoundError);
    });
  });
}); 