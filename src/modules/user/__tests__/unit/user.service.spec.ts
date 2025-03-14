import { GenerateTokensInterface, TokensOutputInterface } from '../../interfaces/generate-user-tokens.interface';
import { Test, TestingModule } from '@nestjs/testing';

import { APP_PIPE } from '@nestjs/core';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { ConfigService } from '@nestjs/config';
import { ConflictError } from 'src/shared/errors/types/conflict.error';
import { CreateUserDto } from '../../dto/create-user.dto';
import { HashProviderInterface } from 'src/shared/interfaces/hash-provider.interface';
import { HttpStatus } from '@nestjs/common';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { JwtModule } from '@nestjs/jwt';
import { SignInDto } from '../../dto/signin.dto';
import { UserEntity } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { UserRepositoryInterface } from '../../interfaces/user.repository.interface';
import { UserService } from '../../user.service';
import { UserWithNoTokenDataBuilder } from '../testing/user-with-no-token-data-builder';
import { UserWithToken } from '../../interfaces/user-with-token.interface';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepositoryInterface;
  let hashProvider: HashProviderInterface;
  let generateTokens: GenerateTokensInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        UserService,
        {
          provide: APP_PIPE,
          useValue: { transform: jest.fn() },
        },
        {
          provide: 'UserRepositoryInterface',
          useClass: UserRepository,
        },
        {
          provide: 'HashProviderInterface',
          useValue: {
            generateHash: jest.fn(),
            compareHash: jest.fn(),
          },
        },
        {
          provide: 'GenerateTokensInterface',
          useValue: {
            generate: jest.fn(),
          },
        },
        {
          provide: 'CONFIGURATION(jwt-refresh)',
          useValue: { secret: 'test-refresh-secret' },
        },
        ConfigService,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepositoryInterface>('UserRepositoryInterface');
    hashProvider = module.get<HashProviderInterface>('HashProviderInterface');
    generateTokens = module.get<GenerateTokensInterface>('GenerateTokensInterface');
  });

  it('should throw a ConflictError if the user already exists', async () => {
    const input: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      first_name: 'John',
      last_name: 'Doe',
      phone: '(11) 12345-6789',
      privacy_consent: true,
      role_id: 1,
    };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(UserWithNoTokenDataBuilder());

    expect(userService.createUser(input)).rejects.toThrow(ConflictError);

    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should create a new user and return the formatted response', async () => {
    const input: CreateUserDto = {
      email: 'test@example.com',
      password: 'password',
      first_name: 'John',
      last_name: 'Doe',
      phone: '(11) 12345-6789',
      privacy_consent: true,
      role_id: 1,
    };

    const output: UserEntity = UserWithNoTokenDataBuilder();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);
    jest.spyOn(hashProvider, 'generateHash').mockResolvedValueOnce('password');
    jest.spyOn(userRepository, 'insert').mockResolvedValueOnce(output);

    const result = await userService.createUser(input);

    expect(result).toEqual({
      status_code: HttpStatus.CREATED,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário criado com sucesso',
      data: output,
      pagination: null,
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(hashProvider.generateHash).toHaveBeenCalledWith('password');
    expect(userRepository.insert).toHaveBeenCalledWith(input);
  });

  it('should login user with correct credentials', async () => {
    const input: SignInDto = { email: 'test@example.com', password: 'password' };

    const user: UserEntity = UserWithNoTokenDataBuilder();

    const tokens: TokensOutputInterface = {
      auth_tokens: {
        access_token: { token: 'mock-access-token', expires_in: 12334 },
        refresh_token: { token: 'mock-refresh-token', expires_in: 12334 },
      },
    };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(user);
    jest.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(true);
    jest.spyOn(generateTokens, 'generate').mockReturnValueOnce(tokens);

    const result: IDefaultResponse<UserWithToken> = await userService.signin(input);

    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(hashProvider.compareHash).toHaveBeenCalledWith('password', 'hashedPassword');
    expect(result).toMatchObject({
      status_code: 200,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário logado com sucesso',
      pagination: null,
      data: expect.objectContaining({
        ...user,
        auth_tokens: expect.objectContaining({
          access_token: expect.objectContaining({
            token: expect.any(String),
            expires_in: expect.any(Number),
          }),
          refresh_token: expect.objectContaining({
            token: expect.any(String),
            expires_in: expect.any(Number),
          }),
        }),
      }),
    });
  });

  it('should throw error if user does not exist', async () => {
    const input: SignInDto = { email: 'test@example.com', password: 'password' };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(null);

    await expect(userService.signin(input)).rejects.toThrow(BadRequestError);
  });

  it('should throw error if password is incorrect', async () => {
    const input: SignInDto = { email: 'test@example.com', password: 'wrongPassword' };

    const user: UserEntity = UserWithNoTokenDataBuilder();

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValueOnce(user);
    jest.spyOn(hashProvider, 'compareHash').mockResolvedValueOnce(false);

    await expect(userService.signin(input)).rejects.toThrow(BadRequestError);
  });

  it('should throw error if input is empty', async () => {
    const input = plainToInstance(SignInDto, { email: '', password: '' });
    const errors = await validate(input);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw error if signinDto has invalid email', async () => {
    const input = plainToInstance(SignInDto, { email: 'invalidEmail', password: 'password' });
    const errors = await validate(input);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should throw error if signinDto has invalid password', async () => {
    const input = plainToInstance(SignInDto, { email: 'test@example.com', password: 1234 });
    const errors = await validate(input);

    expect(errors.length).toBeGreaterThan(0);
  });
});
