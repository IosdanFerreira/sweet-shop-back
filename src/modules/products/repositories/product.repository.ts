import { ProductRepositoryInterface } from '../interfaces/product-repository.interface';
import { ProductEntity } from '../entities/product.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class ProductRepository implements ProductRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,

    @Inject('RemoveAccentsInterface')
    private readonly removeAccents: RemoveAccentsInterface,
  ) {}

  /**
   * Create a new product in the database.
   *
   * @param createDto the data to be inserted in the database
   * @returns the created product
   */
  async insert(createDto: CreateProductDto): Promise<ProductEntity> {
    const { category_id, supplier_id, ...rest } = createDto;

    // Create the data to be inserted
    const data: Prisma.ProductCreateInput = {
      ...rest,
      name_unaccented: this.removeAccents.execute(createDto.name),
      description_unaccented: createDto.description && this.removeAccents.execute(createDto.description),
      // Connect the category and supplier to the product
      category: {
        connect: {
          id: category_id,
        },
      },
      supplier: {
        connect: {
          id: supplier_id,
        },
      },
    };

    // Create the product in the database
    return await this.prisma.product.create({
      data,
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        description: true,
        description_unaccented: false,
        purchase_price: true,
        selling_price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            created_at: true,
            updated_at: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Finds all products in the database.
   *
   * @param page The page of the pagination.
   * @param limit The number of items per page.
   * @param orderBy The order of the items, either 'asc' or 'desc'.
   * @returns An array of products.
   */
  async findAll(page: number, limit: number, orderBy: 'asc' | 'desc' = 'desc'): Promise<ProductEntity[]> {
    const skip = (page - 1) * limit;

    // Find all products in the database, using the given pagination and order
    return await this.prisma.product.findMany({
      // Only return products that are not deleted
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
        description: true,
        description_unaccented: false,
        purchase_price: true,
        selling_price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            created_at: true,
            updated_at: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Finds all products that match the provided search query with pagination and sorting.
   *
   * @param page The page of the pagination.
   * @param limit The number of items per page.
   * @param orderBy The order of the items, either 'asc' or 'desc'.
   * @param search The search query to filter the products.
   * @returns A promise that resolves to an array of filtered product entities.
   */
  async findAllFiltered(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc',
    search: string,
  ): Promise<ProductEntity[]> {
    // Calculate the number of items to skip for pagination
    const skip = (page - 1) * limit;

    // Query the database for products matching the search criteria
    return await this.prisma.product.findMany({
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
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description_unaccented: {
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
        description: true,
        description_unaccented: false,
        purchase_price: true,
        selling_price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            created_at: true,
            updated_at: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Counts all products that have not been deleted.
   *
   * @returns A promise that resolves to the number of products that have not been deleted.
   */
  async countAll(): Promise<number> {
    // Count the number of products that have not been deleted
    return await this.prisma.product.count({
      // Filter the products that have not been deleted
      where: {
        deleted: false,
      },
    });
  }

  /**
   * Counts all products that match the given search query and have not been deleted.
   * The search query is case-insensitive and is performed on the `name` and `name_unaccented` fields.
   *
   * @param search The search query to filter the products.
   * @returns A promise that resolves to the number of products that match the given search query and have not been deleted.
   */
  async countAllFiltered(search: string): Promise<number> {
    // Count the number of products that match the given search query and have not been deleted
    return await this.prisma.product.count({
      // Filter the products that match the given search query and have not been deleted
      where: {
        // The search query is case-insensitive and is performed on the `name` and `name_unaccented` fields
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
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description_unaccented: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        // Filter the products that have not been deleted
        AND: {
          deleted: false,
        },
      },
    });
  }

  /**
   * Finds a product by its ID.
   *
   * @param {number} id - The ID of the product to find.
   * @returns {Promise<ProductEntity>} A promise that resolves to the product entity if found, or null if not found.
   */
  async findById(id: number): Promise<ProductEntity | null> {
    // Find the product in the database by its ID, ensuring it has not been deleted
    return await this.prisma.product.findUnique({
      where: {
        id,
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        description: true,
        description_unaccented: false,
        purchase_price: true,
        selling_price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            created_at: true,
            updated_at: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Updates a product by its ID.
   *
   * @param id The ID of the product to update.
   * @param updateDto The data to update the product with.
   * @returns The updated product entity.
   */
  async update(id: number, updateDto: any): Promise<ProductEntity> {
    // Update the product in the database, ensuring it has not been deleted
    return await this.prisma.product.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        ...updateDto,
        // Update the unaccented name and description
        name_unaccented: updateDto.name && this.removeAccents.execute(updateDto.name),
        description_unaccented: updateDto.description && this.removeAccents.execute(updateDto.description),
      },
      select: {
        id: true,
        name: true,
        name_unaccented: false,
        description: true,
        description_unaccented: false,
        purchase_price: true,
        selling_price: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            created_at: true,
            updated_at: true,
          },
        },
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  /**
   * Soft deletes a product by its ID.
   *
   * @param id The ID of the product to delete.
   */
  async remove(id: number): Promise<void> {
    // Soft delete the product by setting the deleted flag to true
    await this.prisma.product.update({
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
