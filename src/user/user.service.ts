import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositoryInterface } from './repositories/user.repository.interface';
import { CreateUserValidatorFactory } from './validators/create-user.validator';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const inputValidator = CreateUserValidatorFactory.create();

    inputValidator.validate(createUserDto);

    return await this.userRepository.insert(createUserDto);
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
