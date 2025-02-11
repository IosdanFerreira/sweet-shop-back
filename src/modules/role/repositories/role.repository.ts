import { PrismaService } from 'src/prisma/prisma.service';
import { RoleEntity } from '../entities/role.entity';
import { RoleRepositoryInterface } from '../interfaces/role-repository.interface';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';

export class RoleRepository implements RoleRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,
    private readonly removeAccents: RemoveAccentsInterface,
  ) {}

  async insert(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const createdRole = await this.prisma.role.create({
      data: {
        ...createRoleDto,
        name_unaccented: this.removeAccents.execute(createRoleDto.name),
      },
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return createdRole;
  }

  async findAll(): Promise<RoleEntity[]> {
    const roles = await this.prisma.role.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return roles;
  }

  async findById(id: number): Promise<RoleEntity> {
    const foundedRole = await this.prisma.role.findUnique({
      where: {
        id,
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return foundedRole;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    const updatedRole = await this.prisma.role.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        ...updateRoleDto,
        name_unaccented: this.removeAccents.execute(updateRoleDto.name),
      },
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedRole;
  }

  async remove(id: number): Promise<void> {
    await this.prisma.role.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        deleted: true,
      },
    });
  }
}
