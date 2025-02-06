import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '../entities/role.entity';
import { RoleRepositoryInterface } from '../interfaces/role-repository.interface';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

export class RoleRepository implements RoleRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async insert(createRoleDto: CreateRoleDto): Promise<Role> {
    const createdRole = await this.prisma.role.create({
      data: createRoleDto,
      select: {
        id: true,
        role_name: true,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return createdRole;
  }
  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        role_name: true,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return roles;
  }
  async findById(id: number): Promise<Role> {
    const foundedRole = await this.prisma.role.findUnique({
      where: {
        id,
        deleted: false,
      },
      select: {
        id: true,
        role_name: true,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    return foundedRole;
  }
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const updatedRole = await this.prisma.role.update({
      where: {
        id,
      },
      data: updateRoleDto,
      select: {
        id: true,
        role_name: true,
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
      },
      data: {
        deleted: true,
      },
    });
  }
}
