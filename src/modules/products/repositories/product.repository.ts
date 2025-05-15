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
  ) { }

  async insert(createDto: CreateProductDto): Promise<ProductEntity> {
    const { category_id, supplier_id, ...rest } = createDto;

    const data: Prisma.ProductCreateInput = {
      ...rest,
      name_unaccented: this.removeAccents.execute(createDto.name),
      description_unaccented: createDto.description && this.removeAccents.execute(createDto.description),
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

  async findAll(page: number, limit: number, orderBy: 'asc' | 'desc' = 'desc'): Promise<ProductEntity[]> {
    const skip = (page - 1) * limit;

    return await this.prisma.product.findMany({
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

  async findAllFiltered(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc',
    search: string,
  ): Promise<ProductEntity[]> {
    const skip = (page - 1) * limit;

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

  async countAll(): Promise<number> {
    return await this.prisma.product.count({
      where: {
        deleted: false,
      },
    });
  }
  async countAllFiltered(search: string): Promise<number> {
    return await this.prisma.product.count({
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
    });
  }
  async findById(id: number): Promise<ProductEntity> {
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
  async update(id: number, updateDto: any): Promise<ProductEntity> {
    return await this.prisma.product.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        ...updateDto,
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

  async remove(id: number): Promise<void> {
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
