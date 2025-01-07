import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserRepositoryInterface } from './user.repository.interface';

export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async insert(createDto: CreateUserDto): Promise<void> {
    await this.prisma.user.create({
      data: createDto,
    });
  }

  findByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  findById(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }

  update(id: number, updateDto: UpdateUserDto): Promise<void> {
    throw new Error('Method not implemented.');
  }

  remove(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
