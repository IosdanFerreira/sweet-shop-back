import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepositoryInterface } from './user.repository.interface';
import { IUser } from '../interfaces/user.interface';

export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async insert(createDto: CreateUserDto): Promise<IUser> {
    const newUser = await this.prisma.user.create({
      data: createDto,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: false,
        phone: true,
        address: true,
        privacy_consent: true,
        role: {
          select: {
            id: true,
            role_name: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return newUser;
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
        AND: {
          deleted: false,
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        phone: true,
        address: true,
        privacy_consent: true,
        role_id: false,
        role: {
          select: {
            id: true,
            role_name: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }

  async findById(id: number): Promise<IUser> {
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
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: false,
        phone: true,
        address: true,
        privacy_consent: true,
        role: {
          select: {
            id: true,
            role_name: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
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

  protected async _get(id: number): Promise<IUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        AND: {
          deleted: false,
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: false,
        phone: true,
        address: true,
        privacy_consent: true,
        role: {
          select: {
            id: true,
            role_name: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }
}
