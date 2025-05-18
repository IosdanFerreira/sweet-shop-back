import { PrismaService } from 'src/modules/prisma/prisma.service';
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

  /**
   * Inserts a new role into the database.
   * @param createRoleDto - The data transfer object containing role information.
   * @returns A promise that resolves with the created role entity.
   */
  async insert(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    // Create a new role in the database with the provided data
    const createdRole = await this.prisma.role.create({
      data: {
        ...createRoleDto,
        // Remove accents from the role name for unaccented searches
        name_unaccented: this.removeAccents.execute(createRoleDto.name),
      },
      // Select fields to return in the created role entity
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });

    // Return the created role entity
    return createdRole;
  }

  /**
   * Retrieves all roles that are not marked as deleted.
   *
   * @returns A promise that resolves with an array of role entities.
   */
  async findAll(): Promise<RoleEntity[]> {
    // Fetch roles from the database that are not deleted
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

    // Return the retrieved roles
    return roles;
  }

  /**
   * Finds a role by its ID.
   *
   * @param id The ID of the role to find.
   * @returns The role entity if found, or null if not found.
   */
  async findById(id: number): Promise<RoleEntity | null> {
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

    // Return the founded role
    return foundedRole;
  }

  /**
   * Updates a role by its ID.
   *
   * @param id The ID of the role to update.
   * @param updateRoleDto The data to update the role with.
   * @returns The updated role entity.
   */
  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
    // Update the role in the database
    const updatedRole = await this.prisma.role.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        ...updateRoleDto,
        // Remove accents from the name
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

    // Return the updated role
    return updatedRole;
  }

  /**
   * Soft deletes a role by its ID.
   *
   * @param id The ID of the role to delete.
   */
  async remove(id: number): Promise<void> {
    // Soft delete the role by setting the deleted flag to true
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
