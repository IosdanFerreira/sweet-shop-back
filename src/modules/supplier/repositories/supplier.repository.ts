import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SupplierEntity } from '../entities/supplier.entity';
import { SupplierRepositoryInterface } from '../interfaces/supplier-repository.interface';
import { Inject } from '@nestjs/common';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';

export class SupplierRepository implements SupplierRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,

    @Inject('RemoveAccentsInterface')
    private readonly removeAccents: RemoveAccentsInterface,
  ) {}

  /**
   * Insert a new supplier
   * @param createDto the supplier data to be inserted
   * @returns the inserted supplier
   */
  async insert(createDto: CreateSupplierDto): Promise<SupplierEntity> {
    // Insert the supplier into the database
    // The `name_unaccented` field is created by removing the accents from the `name`
    // This is done to allow case-insensitive searches
    return await this.prisma.supplier.create({
      data: {
        ...createDto,
        name_unaccented: this.removeAccents.execute(createDto.name),
      },
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        phone: true,
        email: true,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Get all suppliers
   * @param page the page of suppliers to get
   * @param limit the number of suppliers per page
   * @param orderBy the order of the suppliers (asc or desc)
   * @returns an array of suppliers
   */
  async findAll(page: number, limit: number, orderBy: 'asc' | 'desc'): Promise<SupplierEntity[]> {
    const skip = (page - 1) * limit;

    return await this.prisma.supplier.findMany({
      where: {
        deleted: false,
      },
      skip,
      take: limit,
      orderBy: {
        id: orderBy,
      },
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        phone: true,
        email: true,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }
  /**
   * Get the total number of suppliers
   * @returns the total number of suppliers
   */
  async countAll(): Promise<number> {
    return await this.prisma.supplier.count({
      where: {
        deleted: false,
      },
    });
  }

  /**
   * Find all suppliers that match the given search query
   * @param page the page to search
   * @param limit the number of items to return per page
   * @param orderBy the order of the suppliers (asc or desc)
   * @param search the search query to search in the suppliers
   * @returns an array of suppliers that match the given search query
   */
  async findAllFiltered(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc',
    search: string,
  ): Promise<SupplierEntity[]> {
    const skip = (page - 1) * limit;

    return await this.prisma.supplier.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            name_unaccented: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        AND: {
          deleted: false,
        },
      },
      skip,
      take: limit,
      orderBy: {
        id: orderBy,
      },
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        phone: true,
        email: true,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }
  /**
   * Count the number of suppliers that match the given search query
   * @param search the search query to search in the suppliers
   * @returns the number of suppliers that match the given search query
   */
  async countAllFiltered(search: string): Promise<number> {
    // Count the number of suppliers that match the given search query
    // The search query is case-insensitive
    // The search is performed on the `name` and `name_unaccented` fields
    return await this.prisma.supplier.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            name_unaccented: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        AND: {
          deleted: false,
        },
      },
    });
  }
  /**
   * Finds a supplier by its ID.
   *
   * @param id The ID of the supplier to find.
   * @returns The supplier entity if found, or null if not found.
   */
  async findById(id: number): Promise<SupplierEntity | null> {
    return await this.prisma.supplier.findUnique({
      where: {
        id,
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        phone: true,
        email: true,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Updates a supplier by its ID.
   *
   * @param id The ID of the supplier to update.
   * @param updateDto The data to update the supplier with.
   * @returns The updated supplier entity.
   */
  async update(id: number, updateDto: UpdateSupplierDto): Promise<SupplierEntity> {
    return await this.prisma.supplier.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        ...updateDto,
        name_unaccented: this.removeAccents.execute(updateDto.name),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        name_unaccented: false,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }
  /**
   * Soft deletes a supplier by its ID.
   *
   * @param id The ID of the supplier to delete.
   */
  async remove(id: number): Promise<void> {
    // Soft delete the supplier
    // The `deleted` field is set to true
    // The `updated_at` field is set to the current timestamp
    // No other fields are modified
    await this.prisma.supplier.update({
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
