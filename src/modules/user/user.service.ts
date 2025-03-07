import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HashProviderInterface } from 'src/shared/interfaces/hash-provider.interface';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from '../../config/jwt-refresh.config';
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
  ) {}

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

  async signin(signinDto: SignInDto): Promise<IDefaultResponse<UserWithToken>> {
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

    // Formata a resposta no formato padrão
    const loggedUser: IDefaultResponse<UserWithToken> = {
      status_code: HttpStatus.OK,
      success: true,
      error_type: null,
      errors: null,
      message: 'Usuário logado com sucesso',
      data: { ...userAlreadyExists, ...tokens },
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

  refresh(user: UserEntity) {
    // Cria uma instância da classe que gera os tokens
    const tokenGenerator = new generateTokens(this.jwtService, this.refreshTokenConfig);

    // Chama o método generate da classe para gerar os tokens assinados com os dados do usuário
    const tokens = tokenGenerator.generate(user);

    return {
      access_token: tokens.auth_tokens.access_token,
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
