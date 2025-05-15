import { HttpStatus, Inject, Injectable, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HashProviderInterface } from 'src/shared/interfaces/hash-provider.interface';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from '../../shared/config/jwt-refresh.config';
import { ConfigType } from '@nestjs/config';
import { UserWithToken } from './interfaces/user-with-token.interface';
import { SignInDto } from './dto/signin.dto';
import { generateTokens } from './utils/generate-user-tokens.utils';
import { UserEntity } from './entities/user.entity';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { ConflictError } from 'src/shared/errors/types/conflict.error';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { IDefaultResponse } from 'src/shared/interfaces/default-response.interface';
import { UserRepositoryInterface } from './interfaces/user.repository.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('HashProviderInterface')
    private readonly hashProvider: HashProviderInterface,

    private readonly jwtService: JwtService,

    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<IDefaultResponse<UserEntity>> {
    // Checa se o email do usuário ja existe
    const userAlreadyExists = await this.userRepository.findByEmail(createUserDto.email);

    // Se o email existir no banco, retorna um erro
    if (userAlreadyExists) {
      throw new ConflictError([
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

  async signin(signinDto: SignInDto, @Res({ passthrough: true }) response: Response): Promise<IDefaultResponse<UserEntity>> {
    // Checa se o email do usuário existe
    const userAlreadyExists = await this.userRepository.findByEmail(signinDto.email);

    // Se o email não existir, retorna um erro
    if (!userAlreadyExists) {
      throw new BadRequestError([
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
      throw new BadRequestError([
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

    // Configura os cookies seguros
    response.cookie('accessToken', tokens.auth_tokens.access_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    response.cookie('refreshToken', tokens.auth_tokens.refresh_token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/user/refresh'
    });

    // Formata a resposta no formato padrão
    const loggedUser: IDefaultResponse<UserEntity> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário logado com sucesso',
      data: { ...userAlreadyExists, },
      pagination: null,
    };

    return loggedUser;
  }

  async getUserById(id: number): Promise<IDefaultResponse<UserEntity>> {
    // Busca o usuário no banco pelo ID informado
    return await this._get(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    // Busca o usuário no banco pelo ID informado
    await this._get(id);

    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestError([
        {
          property: null,
          message: 'Nenhuma informação foi fornecida',
        },
      ]);
    }

    // Atualiza os dados do usuário
    const updatedUser = await this.userRepository.update(id, updateUserDto);

    // Formata a resposta no formato padrão
    const formattedUser = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Dados do usuário atualizado',
      data: updatedUser,
      pagination: null,
    };

    return formattedUser;
  }

  async deleteUser(id: number): Promise<IDefaultResponse<null>> {
    // Busca o usuário no banco pelo ID informado
    await this._get(id);

    // Exclui o usuário
    await this.userRepository.remove(id);

    // Formata a resposta no formato padrão
    const formattedResponse = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário excluído',
      data: null,
      pagination: null,
    };

    return formattedResponse;
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
      maxAge: 15 * 60 * 1000,
    });

    return {
      message: 'Token renovado com sucesso',
    };
  }

  protected async _get(id: number): Promise<IDefaultResponse<UserEntity>> {
    // Busca o usuário no banco pelo ID informado
    const foundedUser = await this.userRepository.findById(id);

    // Se o usuário nao for encontrado, retorna um erro
    if (!foundedUser) {
      throw new NotFoundError([
        {
          property: null,
          message: 'Usuário não encontrado',
        },
      ]);
    }

    // Formata a resposta no formato padrão
    const formattedUser = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário encontrado',
      data: foundedUser,
      pagination: null,
    };

    return formattedUser;
  }
}
