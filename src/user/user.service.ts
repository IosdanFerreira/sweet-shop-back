import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositoryInterface } from './repositories/user.repository.interface';
import { HashProviderInterface } from 'src/shared/providers/hash-provider/hash-provider.interface';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from '../shared/config/jwt-refresh.config';
import { ConfigType } from '@nestjs/config';
import { IUserWithToken } from './interfaces/user-with-token.interface';
import { SignInDto } from './dto/signin.dto';
import { generateTokens } from './utils/generate-user-tokens.utils';
import { IUser } from './interfaces/user.interface';
import { BadRequestError } from 'src/shared/errors/bad-request.error';
import { ConflictError } from 'src/shared/errors/conflict.error';
import { NotFoundError } from 'src/shared/errors/not-found.error';
import { IDefaultResponse } from 'src/shared/@types/default-response.interface';

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

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<IDefaultResponse<IUser>> {
    // Checa se o email do usuário ja existe
    const userAlreadyExists = await this.userRepository.findByEmail(
      createUserDto.email,
    );

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
    const hashedPassword = await this.hashProvider.generateHash(
      createUserDto.password,
    );

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
      data: { ...createdUser },
      pagination: null,
    };

    return formattedNewUser;
  }

  async signin(
    signinDto: SignInDto,
  ): Promise<IDefaultResponse<IUserWithToken>> {
    // Checa se o email do usuário existe
    const userAlreadyExists = await this.userRepository.findByEmail(
      signinDto.email,
    );

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
    const isValidPassword = await this.hashProvider.compareHash(
      signinDto.password,
      userAlreadyExists.password,
    );

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
    const tokenGenerator = new generateTokens(
      this.jwtService,
      this.refreshTokenConfig,
    );
    const tokens = tokenGenerator.generate(userAlreadyExists);

    const loggedUser: IDefaultResponse<IUserWithToken> = {
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

  async getUserById(id: number): Promise<IUser> {
    return await this._get(id);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    await this._get(id);

    const updatedUser = await this.userRepository.update(id, updateUserDto);

    return updatedUser;
  }

  async deleteUser(id: number) {
    await this._get(id);

    await this.userRepository.remove(id);
  }

  refresh(user: IUser) {
    const tokenGenerator = new generateTokens(
      this.jwtService,
      this.refreshTokenConfig,
    );

    return tokenGenerator.generate(user);
  }

  protected async _get(id: number): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError([
        {
          property: null,
          message: 'Usuário não encontrado',
        },
      ]);
    }

    return user;
  }
}
