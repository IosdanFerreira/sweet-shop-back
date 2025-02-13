import { PrismaService } from 'src/prisma/prisma.service';
import { StockMovementEntity } from '../entities/stock-movement.entity';
import { StockMovementsRepositoryInterface } from '../interfaces/stock-movements-repository.interface';
import { CreateStockMovementDto } from '../dto/create-stock-movement.dto';
import { Prisma } from '@prisma/client';

export class StockMovementsRepository implements StockMovementsRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async registerEntry(stockMovementDTO: CreateStockMovementDto): Promise<StockMovementEntity> {
    return await this.prisma.$transaction(async (prisma) => {
      const productWithUpdatedStock = await prisma.product.update({
        where: {
          id: stockMovementDTO.product_id,
        },
        data: {
          stock: {
            increment: stockMovementDTO.quantity,
          },
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
              created_at: true,
              updated_at: true,
            },
          },
          deleted: false,
          created_at: true,
          updated_at: true,
        },
      });

      const stockMovement = await this.prisma.stockMovement.create({
        data: {
          ...stockMovementDTO,
          type: 'increase',
        },
        select: {
          id: true,
          type: true,
          quantity: true,
          created_at: true,
          updated_at: true,
          product: false,
          product_id: false,
        },
      });

      return {
        ...stockMovement,
        product: productWithUpdatedStock,
      };
    });
  }

  async registerExit(stockMovementDTO: CreateStockMovementDto): Promise<StockMovementEntity> {
    return await this.prisma.$transaction(async (prisma) => {
      const productWithUpdatedStock = await prisma.product.update({
        where: {
          id: stockMovementDTO.product_id,
        },
        data: {
          stock: {
            decrement: stockMovementDTO.quantity,
          },
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
              created_at: true,
              updated_at: true,
            },
          },
          deleted: false,
          created_at: true,
          updated_at: true,
        },
      });

      const stockMovement = await this.prisma.stockMovement.create({
        data: {
          ...stockMovementDTO,
          type: 'decrease',
        },
        select: {
          id: true,
          type: true,
          quantity: true,
          created_at: true,
          updated_at: true,
          product: false,
          product_id: false,
        },
      });

      return {
        ...stockMovement,
        product: productWithUpdatedStock,
      };
    });
  }

  async getMovements(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    conditionalFilters?: Prisma.StockMovementWhereInput,
  ): Promise<StockMovementEntity[]> {
    const skip = (page - 1) * limit;

    return await this.prisma.stockMovement.findMany({
      where: conditionalFilters,
      take: limit,
      skip,
      orderBy: {
        id: orderBy,
      },
      select: {
        id: true,
        type: true,
        quantity: true,
        created_at: true,
        updated_at: true,
        product: {
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
                created_at: true,
                updated_at: true,
              },
            },
            deleted: false,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });
  }

  async countAll(conditionalFilters: Prisma.StockMovementWhereInput): Promise<number> {
    return await this.prisma.stockMovement.count({
      where: conditionalFilters,
    });
  }
}
