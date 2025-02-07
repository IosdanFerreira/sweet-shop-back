import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '../entities/category.entity';
import { CategoryRepositoryInterface } from '../interfaces/category-repository.interface';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Inject } from '@nestjs/common';

export class CategoryRepository implements CategoryRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,

    @Inject('RemoveAccentsInterface')
    private readonly removeAccents: RemoveAccentsInterface,
  ) {}

  async insert(createDto: CreateCategoryDto): Promise<Category> {
    return await this.prisma.category.create({
      data: {
        ...createDto,
        name_unaccented: this.removeAccents.execute(createDto.name),
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

  async findAll(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
  ): Promise<Category[]> {
    const skip = (page - 1) * limit;

    return await this.prisma.category.findMany({
      where: {
        deleted: false,
        AND: { deleted: false },
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

  async findAllFiltered(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    search: string,
  ): Promise<Category[]> {
    const skip = (page - 1) * limit;
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

  async countAll(): Promise<number> {
    return await this.prisma.category.count({
      where: {
        deleted: false,
      },
    });
  }

  async countAllFiltered(search: string): Promise<number> {
    return await this.prisma.category.count({
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

  async findById(id: number): Promise<Category> {
    return await this.prisma.category.findUnique({
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
  }

  async update(id: number, updateDto: any): Promise<Category> {
    return await this.prisma.category.update({
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
        name_unaccented: false,
        deleted: false,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.category.update({
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
