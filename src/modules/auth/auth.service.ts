import { HttpStatus, Inject, Injectable, Res } from '@nestjs/common';
import { UserRepositoryInterface } from '../user/interfaces/user.repository.interface';
import { HashProviderInterface } from 'src/shared/interfaces/hash-provider.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import refreshJwtConfig from '../../shared/config/jwt-refresh.config';
import { SignInDto } from '../user/dto/signin.dto';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { UserEntity } from '../user/entities/user.entity';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { generateTokens } from '../user/utils/generate-user-tokens.utils';
import { Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
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

  async createUser(createUserDto: CreateUserDto): Promise<IDefaultResponse<UserEntity>> {
    // Checa se o email do usuário ja existe
    const userAlreadyExists = await this.userRepository.findByEmail(createUserDto.email);

    // Se o email existir no banco, retorna um erro
    if (userAlreadyExists) {
      throw new ConflictError('Erro ao cadastrar novo usuário', [
        {
          property: 'email',
          message: 'Já existe um usuário com esse endereço de email',
        },
      ]);
    }

    // Caso o novo usuário seja válido
    // Cria o hash da senha
    const hashedPassword = await this.hashProvider.generateHash(createUserDto.password);

    // Cria o usuário no banco
    const createdUser = await this.userRepository.insert({
      ...createUserDto,
      password: hashedPassword,
    });

    // Formata a resposta no formato padrão de resposta
    const formattedNewUser = {
      status_code: HttpStatus.CREATED,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário criado com sucesso',
      data: createdUser,
      pagination: null,
    };

    return formattedNewUser;
  }

  async signin(
    signinDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IDefaultResponse<UserEntity>> {
    // Checa se o email do usuário existe
    const userAlreadyExists = await this.userRepository.findByEmail(signinDto.email);

    // Se o email não existir, retorna um erro
    if (!userAlreadyExists) {
      throw new BadRequestError('Erro ao realizar login', [
        {
          property: 'email/password',
          message: 'Email ou senha inválidos',
        },
      ]);
    }

    // Checa se a senha informada corresponde a senha do usuário cadastrado
    const isValidPassword = await this.hashProvider.compareHash(signinDto.password, userAlreadyExists.password);

    // Se a senha informada não corresponder, retorna um erro
    if (!isValidPassword) {
      throw new BadRequestError('Erro ao realizar login', [
        {
          property: 'email/password',
          message: 'Email ou senha inválidos',
        },
      ]);
    }

    // Exclui dados sensíveis do usuário no retorno
    delete userAlreadyExists.password;
    delete userAlreadyExists.deleted;

    // Gera os tokens de acesso e refresh
    const tokenGenerator = new generateTokens(this.jwtService, this.refreshTokenConfig);
    const tokens = tokenGenerator.generate(userAlreadyExists);

    // Configura os tokens nos cookies
    response.cookie('accessToken', tokens.auth_tokens.access_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refreshToken', tokens.auth_tokens.refresh_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/user/refresh',
    });

    // Formata a resposta no formato padrão
    const loggedUser: IDefaultResponse<UserEntity> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário logado com sucesso',
      data: { ...userAlreadyExists },
      pagination: null,
    };

    return loggedUser;
  }

  async signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/user/refresh',
    });

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

  async refresh(user: UserEntity, res: Response) {
    // Cria uma instância da classe que gera os tokens
    const tokenGenerator = new generateTokens(this.jwtService, this.refreshTokenConfig);

    // Chama o método generate da classe para gerar os tokens assinados com os dados do usuário
    const tokens = tokenGenerator.generate(user);

    // Define o novo access token no cookie
    res.cookie('accessToken', tokens.auth_tokens.access_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 1000,
    });

    return {
      message: 'Token renovado com sucesso',
    };
  }
}
