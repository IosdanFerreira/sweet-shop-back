import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositoryInterface } from './repositories/user.repository.interface';
import { HashProviderInterface } from 'src/shared/providers/hash-provider/hash-provider.interface';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from '../shared/config/jwt-refresh.config';
import { ConfigType } from '@nestjs/config';
import { UserOutputWithToken } from './interfaces/user-output-with-token.interface';
import { SignInDto } from './dto/signin.dto';
import { generateTokens } from './utils/generate-user-tokens.utils';
import { UserOutput } from './interfaces/user-output.interface';

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

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const userAlreadyExists = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (userAlreadyExists) {
      throw new ConflictException(
        'Já existe um usuário com esse endereço de email',
      );
    }

    const hashedPassword = await this.hashProvider.generateHash(
      createUserDto.password,
    );

    const newUser: CreateUserDto = {
      ...createUserDto,
      password: hashedPassword,
    };

    return await this.userRepository.insert(newUser);
  }

  async signin(signinDto: SignInDto): Promise<UserOutputWithToken> {
    const userAlreadyExists = await this.userRepository.findByEmail(
      signinDto.email,
    );

    if (!userAlreadyExists) {
      throw new BadRequestException('Email ou senha inválidos');
    }

    const isValidPassword = await this.hashProvider.compareHash(
      signinDto.password,
      userAlreadyExists.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Email ou senha inválidos');
    }

    delete userAlreadyExists.password;
    delete userAlreadyExists.deleted;

    const tokenGenerator = new generateTokens(
      this.jwtService,
      this.refreshTokenConfig,
    );

    const tokens = tokenGenerator.generate(userAlreadyExists);

    const user = {
      ...userAlreadyExists,
      ...tokens,
    };

    return user;
  }

  async getUserById(id: number): Promise<UserOutput> {
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

  refresh(user: UserOutput) {
    const tokenGenerator = new generateTokens(
      this.jwtService,
      this.refreshTokenConfig,
    );

    return tokenGenerator.generate(user);
  }

  protected async _get(id: number): Promise<UserOutput> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
