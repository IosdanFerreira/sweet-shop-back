import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '11999999999',
    address: 'Rua Example, 123',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockUserService = {
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLoggedUser', () => {
    it('should return logged user data', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: mockUser,
      };

      mockUserService.getUserById.mockResolvedValue(mockResponse);

      const result = await controller.getLoggedUser({ user: { id: 1 } });

      expect(result).toEqual(mockResponse);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('findUserByID', () => {
    it('should return user by id', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: mockUser,
      };

      mockUserService.getUserById.mockResolvedValue(mockResponse);

      const result = await controller.findUserByID('1');

      expect(result).toEqual(mockResponse);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@example.com',
        phone: '11999999999',
        address: 'Rua Example, 123',
      };

      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: { ...mockUser, ...updateUserDto },
      };

      mockUserService.updateUser.mockResolvedValue(mockResponse);

      const result = await controller.update('1', updateUserDto);

      expect(result).toEqual(mockResponse);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const mockResponse = {
        status_code: HttpStatus.OK,
        success: true,
        data: null,
      };

      mockUserService.deleteUser.mockResolvedValue(mockResponse);

      const result = await controller.remove('1');

      expect(result).toEqual(mockResponse);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
    });
  });
});
