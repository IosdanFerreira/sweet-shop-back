import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositoryInterface } from './repositories/user.repository.interface';
import { HashProviderInterface } from 'src/shared/providers/hash-provider/hash-provider.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('HashProviderInterface')
    private readonly hashProvider: HashProviderInterface,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
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

  async getUserById(id: number) {
    return await this.userRepository.findById(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
