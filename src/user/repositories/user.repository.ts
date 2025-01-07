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

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        AND: {
          deleted: false,
        },
      },
    });

    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this._get(id);

    return user;
  }

  async update(id: number, updateDto: UpdateUserDto): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
        AND: {
          deleted: false,
        },
      },
      data: updateDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
        AND: {
          deleted: false,
        },
      },
      data: {
        deleted: true,
      },
    });
  }

  protected async _get(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        AND: {
          deleted: false,
        },
      },
    });

    return user;
  }
}
