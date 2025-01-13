import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepositoryInterface } from './user.repository.interface';
import { UserOutput } from '../interfaces/user-output.interface';
import { User } from '../entities/user.entity';

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

  async findById(id: number): Promise<UserOutput> {
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

  protected async _get(id: number): Promise<UserOutput> {
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
        gender: true,
        birth_date: true,
        address: true,
        occupation: true,
        emergency_contact_name: true,
        emergency_contact_number: true,
        primary_physician: true,
        insurance_provider: true,
        insurance_policy_number: true,
        allergies: true,
        current_medication: true,
        family_medical_history: true,
        past_medical_history: true,
        identification_type: true,
        identification_number: true,
        identification_document: true,
        privacy_consent: true,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }
}
