import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { Response } from 'express';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { ConflictError } from 'src/shared/errors/types/conflict.error';
import { UserEntity } from '../user/entities/user.entity';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { HttpStatus } from '@nestjs/common';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import refreshJwtConfig from '../../shared/config/jwt-refresh.config';
import { RoleEntity } from '../role/entities/role.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: any;
  let hashProvider: any;
  let jwtService: JwtService;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    insert: jest.fn(),
  };

  const mockHashProvider = {
    generateHash: jest.fn(),
    compareHash: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockRefreshTokenConfig = {
    secret: 'test-refresh-secret',
    expiresIn: '7d',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        AuthService,
        {
          provide: 'UserRepositoryInterface',
          useValue: mockUserRepository,
        },
        {
          provide: 'HashProviderInterface',
          useValue: mockHashProvider,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: refreshJwtConfig.KEY,
          useValue: mockRefreshTokenConfig,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get('UserRepositoryInterface');
    hashProvider = module.get('HashProviderInterface');
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const signUpDto: SignUpDto = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '(11) 91122-3344',
        privacy_consent: true,
        role_id: 1
      };

      const hashedPassword = 'hashed_password';
      const mockRole: RoleEntity = {
        id: 1,
        name: 'User',
        created_at: new Date(),
        updated_at: new Date()
      };

      const createdUser: UserEntity = {
        id: 1,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: hashedPassword,
        phone: '(11) 91122-3344',
        address: null,
        privacy_consent: true,
        role: mockRole,
        deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockHashProvider.generateHash.mockResolvedValue(hashedPassword);
      mockUserRepository.insert.mockResolvedValue(createdUser);

      const result = await authService.signup(signUpDto);

      expect(result.status_code).toBe(HttpStatus.CREATED);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdUser);
      expect(result.message).toBe('Usuário criado com sucesso');
    });

    it('should throw ConflictError when user already exists', async () => {
      const signUpDto: SignUpDto = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '(11) 91122-3344',
        privacy_consent: true,
        role_id: 1
      };

      mockUserRepository.findByEmail.mockResolvedValue({ id: 1, email: signUpDto.email });

      await expect(authService.signup(signUpDto)).rejects.toThrow(ConflictError);
    });
  });

  describe('signin', () => {
    it('should authenticate user and return tokens', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRole: RoleEntity = {
        id: 1,
        name: 'User',
        created_at: new Date(),
        updated_at: new Date()
      };

      const user: UserEntity = {
        id: 1,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'hashed_password',
        phone: '(11) 91122-3344',
        address: null,
        privacy_consent: true,
        role: mockRole,
        deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockHashProvider.compareHash.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mock_token');

      const result = await authService.signin(signInDto, mockResponse);

      expect(result.status_code).toBe(HttpStatus.OK);
      expect(result.success).toBe(true);
      expect(mockResponse.cookie).toHaveBeenCalled();
      expect(result.data).toBeDefined();
      expect(result.data.password).toBeUndefined();
    });

    it('should throw BadRequestError when user does not exist', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.signin(signInDto, mockResponse)).rejects.toThrow(BadRequestError);
    });

    it('should throw BadRequestError when password is invalid', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      const mockRole: RoleEntity = {
        id: 1,
        name: 'User',
        created_at: new Date(),
        updated_at: new Date()
      };

      const user: UserEntity = {
        id: 1,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'hashed_password',
        phone: '(11) 91122-3344',
        address: null,
        privacy_consent: true,
        role: mockRole,
        deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockHashProvider.compareHash.mockResolvedValue(false);

      await expect(authService.signin(signInDto, mockResponse)).rejects.toThrow(BadRequestError);
    });
  });
}); 