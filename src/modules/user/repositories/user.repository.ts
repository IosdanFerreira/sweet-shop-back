import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepositoryInterface } from '../interfaces/user.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';

export class UserRepository implements UserRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly removeAccents: RemoveAccentsInterface,
  ) { }

  async insert(createDto: CreateUserDto): Promise<UserEntity> {
    const newUser = await this.prisma.user.create({
      data: {
        ...createDto,
        first_name_unaccented: this.removeAccents.execute(createDto.first_name),
        last_name_unaccented: this.removeAccents.execute(createDto.last_name),
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
            name: true,
            created_at: true,
            updated_at: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return newUser;
  }

  async findByEmail(email: string): Promise<UserEntity> {
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
            name: true,
            created_at: true,
            updated_at: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this._get(id);

    return user;
  }

  async update(id: number, updateDto: UpdateUserDto): Promise<UserEntity> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id,
        AND: {
          deleted: false,
        },
      },
      data: {
        ...updateDto,
        first_name_unaccented: updateDto.first_name ? this.removeAccents.execute(updateDto.first_name) : undefined,
        last_name_unaccented: updateDto.last_name ? this.removeAccents.execute(updateDto.last_name) : undefined,
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
            name: true,
            created_at: true,
            updated_at: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedUser;
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

  protected async _get(id: number): Promise<UserEntity> {
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
            name: true,
            created_at: true,
            updated_at: true,
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
