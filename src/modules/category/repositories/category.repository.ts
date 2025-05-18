import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CategoryRepositoryInterface } from '../interfaces/category-repository.interface';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Inject } from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryRepository implements CategoryRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,

    @Inject('RemoveAccentsInterface')
    private readonly removeAccents: RemoveAccentsInterface,
  ) {}

  /**
   * Inserts a new category into the database.
   *
   * @param createDto The data transfer object containing category information.
   * @returns A promise that resolves with the created category entity.
   */
  async insert(createDto: CreateCategoryDto): Promise<CategoryEntity> {
    // Create a new category in the database with the provided data
    return await this.prisma.category.create({
      data: {
        ...createDto,
        // Remove accents from the category name for unaccented searches
        name_unaccented: this.removeAccents.execute(createDto.name),
      },
      // Select fields to return in the created category entity
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Retrieves all categories with pagination.
   *
   * @param page The page number for pagination.
   * @param limit The number of items per page.
   * @param orderBy The order of the items, either 'asc' or 'desc'.
   * @returns A promise that resolves to an array of category entities.
   */
  async findAll(page: number, limit: number, orderBy: 'asc' | 'desc' = 'desc'): Promise<CategoryEntity[]> {
    // Calculate the number of items to skip for pagination
    const skip = (page - 1) * limit;

    // Fetch categories from the database that are not deleted
    return await this.prisma.category.findMany({
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
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Finds all categories that match the given search query with pagination and sorting.
   *
   * @param page The page of the pagination.
   * @param limit The number of items per page.
   * @param orderBy The order of the items, either 'asc' or 'desc'.
   * @param search The search query to filter the categories.
   * @returns A promise that resolves to an array of category entities.
   */
  async findAllFiltered(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    search: string,
  ): Promise<CategoryEntity[]> {
    // Calculate the number of items to skip for pagination
    const skip = (page - 1) * limit;

    // Query the database for categories matching the search query
    // The search query is case-insensitive and is performed on the `name` and `name_unaccented` fields
    // The categories must not be deleted
    return await this.prisma.category.findMany({
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
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Counts all categories that are not deleted.
   *
   * @returns A promise that resolves with the number of categories that are not deleted.
   */
  async countAll(): Promise<number> {
    // Count the number of categories in the database that are not deleted
    return await this.prisma.category.count({
      // Filter the categories that are not deleted
      where: {
        deleted: false,
      },
    });
  }

  /**
   * Counts all categories that are not deleted and match the given search query.
   *
   * The search query is case-insensitive and is performed on the `name` and `name_unaccented` fields.
   *
   * @param search The search query to filter the categories.
   * @returns A promise that resolves with the number of categories that are not deleted and match the search query.
   */
  async countAllFiltered(search: string): Promise<number> {
    // Count the number of categories that are not deleted and match the search query
    return await this.prisma.category.count({
      // Filter the categories that match the search query
      where: {
        OR: [
          // The search query is case-insensitive and is performed on the `name` field
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          // The search query is case-insensitive and is performed on the `name_unaccented` field
          {
            name_unaccented: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        // The categories must not be deleted
        AND: {
          deleted: false,
        },
      },
    });
  }

  /**
   * Finds a category by its ID.
   *
   * The category must not be deleted.
   *
   * @param id The ID of the category to find.
   * @returns A promise that resolves to the category entity if found, or null if not found.
   */
  async findById(id: number): Promise<CategoryEntity | null> {
    // Retrieve the category to ensure it exists
    return await this.prisma.category.findUnique({
      // Filter the category by its ID
      where: {
        id,
        // The category must not be deleted
        deleted: false,
      },
      // Select the fields to return in the category entity
      select: {
        id: true,
        name: true,
        // Do not return the `name_unaccented` field
        name_unaccented: false,
        // Do not return the `deleted` field
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Updates a category by its ID.
   *
   * The category must not be deleted.
   *
   * @param id The ID of the category to update.
   * @param updateDto The data to update the category with.
   * @returns A promise that resolves with the updated category entity.
   */
  async update(id: number, updateDto: any): Promise<CategoryEntity> {
    // Update the category in the database, ensuring it has not been deleted
    return await this.prisma.category.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        // Update the category with the new data, removing any accents from the name
        ...updateDto,
        name_unaccented: this.removeAccents.execute(updateDto.name),
      },
      // Select the fields to return in the updated category entity
      select: {
        id: true,
        name: true,
        // Do not return the `name_unaccented` field
        name_unaccented: false,
        // Do not return the `deleted` field
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Soft deletes a category by its ID.
   *
   * The category must not be deleted.
   *
   * @param id The ID of the category to delete.
   * @returns A promise that resolves when the category has been deleted.
   */
  async remove(id: number): Promise<void> {
    // Soft delete the category by setting the deleted flag to true
    await this.prisma.category.update({
      where: {
        // Filter the category by its ID
        id,
        // The category must not be deleted
        deleted: false,
      },
      data: {
        // Set the deleted flag to true
        deleted: true,
      },
    });
  }
}
