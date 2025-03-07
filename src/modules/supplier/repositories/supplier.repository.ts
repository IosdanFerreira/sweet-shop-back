import { PrismaService } from 'src/prisma/prisma.service';
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

  async insert(createDto: CreateSupplierDto): Promise<SupplierEntity> {
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
  async countAll(): Promise<number> {
    return await this.prisma.supplier.count({
      where: {
        deleted: false,
      },
    });
  }

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
  async countAllFiltered(search: string): Promise<number> {
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
  async findById(id: number): Promise<SupplierEntity> {
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
  async remove(id: number): Promise<void> {
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
