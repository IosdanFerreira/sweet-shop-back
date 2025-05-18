import { HttpStatus, Inject, Injectable, Res } from '@nestjs/common';
import { UserRepositoryInterface } from '../user/interfaces/user.repository.interface';
import { HashProviderInterface } from 'src/shared/interfaces/hash-provider.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import refreshJwtConfig from '../../shared/config/jwt-refresh.config';
import { SignInDto } from './dto/signin.dto';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { UserEntity } from '../user/entities/user.entity';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { generateTokens } from '../user/utils/generate-user-tokens.utils';
import { Response } from 'express';
import { SignUpDto } from './dto/signup.dto';
import { ConflictError } from 'src/shared/errors/types/conflict.error';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('HashProviderInterface')
    private readonly hashProvider: HashProviderInterface,

    private readonly jwtService: JwtService,

    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  /**
   * Registers a new user with the provided data.
   * @param signUpDto The data to register the user with.
   * @returns A promise with the formatted response indicating success.
   */
  async signup(signUpDto: SignUpDto): Promise<IDefaultResponse<UserEntity>> {
    // Check if a user with the same email already exists
    const userAlreadyExists = await this.userRepository.findByEmail(signUpDto.email);

    if (userAlreadyExists) {
      // If a user with the same email exists, throw a conflict error
      throw new ConflictError('Erro ao cadastrar novo usuário', [
        {
          property: 'email',
          message: 'Já existe um usuário com esse endereço de email',
        },
      ]);
    }

    // Hash the provided password
    const hashedPassword = await this.hashProvider.generateHash(signUpDto.password);

    // Create the new user
    const createdUser = await this.userRepository.insert({
      ...signUpDto,
      password: hashedPassword,
    });

    // Format the response
    const formattedNewUser = {
      status_code: HttpStatus.CREATED,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário criado com sucesso',
      data: createdUser,
      pagination: null,
    };

    // Return the formatted response
    return formattedNewUser;
  }

  /**
   * Performs the signin of a user with the provided data.
   * @param signinDto The data to signin the user with.
   * @param response The response object to set the cookies.
   * @returns A promise with the formatted response indicating success.
   */
  async signin(
    signinDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IDefaultResponse<UserEntity>> {
    // Check if a user with the same email already exists
    const userAlreadyExists = await this.userRepository.findByEmail(signinDto.email);

    if (!userAlreadyExists) {
      // If the user does not exist, throw a bad request error
      throw new BadRequestError('Erro ao realizar login', [
        {
          property: 'email/password',
          message: 'Email ou senha inválidos',
        },
      ]);
    }

    // Check if the provided password is valid
    const isValidPassword = await this.hashProvider.compareHash(signinDto.password, userAlreadyExists.password);

    if (!isValidPassword) {
      // If the password is not valid, throw a bad request error
      throw new BadRequestError('Erro ao realizar login', [
        {
          property: 'email/password',
          message: 'Email ou senha inválidos',
        },
      ]);
    }

    // Remove the password from the user data
    delete userAlreadyExists.password;
    delete userAlreadyExists.deleted;

    // Create a new instance of the class that generates the tokens
    const tokenGenerator = new generateTokens(this.jwtService, this.refreshTokenConfig);

    // Generate the access and refresh tokens
    const tokens = tokenGenerator.generate(userAlreadyExists);

    // Set the access token cookie
    response.cookie('accessToken', tokens.auth_tokens.access_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    // Set the refresh token cookie
    response.cookie('refreshToken', tokens.auth_tokens.refresh_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/user/refresh',
    });

    // Format the response
    const loggedUser: IDefaultResponse<UserEntity> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário logado com sucesso',
      data: { ...userAlreadyExists },
      pagination: null,
    };

    // Return the formatted response
    return loggedUser;
  }

  /**
   * Signs the user out by clearing the authentication cookies.
   * @param res The response object used to clear cookies.
   * @returns A promise with the formatted response indicating successful logout.
   */
  async signout(@Res({ passthrough: true }) res: Response) {
    // Clear the access token cookie
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/user/refresh',
    });

    // Return a success response for the logout operation
    return {
      status_code: 200,
      success: true,
      error_type: null,
      errors: null,
      message: 'Logout efetuado com sucesso',
      data: null,
      pagination: null,
    };
  }

  /**
   * Refreshes the user's access token by generating a new one based on the user's data.
   * @param user The user to refresh the token for.
   * @param res The response object used to set the new access token cookie.
   * @returns A promise with the formatted response indicating successful token refresh.
   */
  async refresh(user: UserEntity, res: Response): Promise<IDefaultResponse<null>> {
    // Create a new instance of the class that generates the tokens
    const tokenGenerator = new generateTokens(this.jwtService, this.refreshTokenConfig);

    // Call the generate method of the class to generate the signed tokens with the user's data
    const tokens = tokenGenerator.generate(user);

    // Define the new access token cookie
    res.cookie('accessToken', tokens.auth_tokens.access_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 1000,
    });

    // Return a success response for the token refresh operation
    return {
      status_code: 200,
      success: true,
      error_type: null,
      errors: null,
      message: 'Token renovado com sucesso',
      data: null,
      pagination: null,
    };
  }
}
