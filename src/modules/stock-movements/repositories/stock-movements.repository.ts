import { CreateStockMovementDto } from '../dto/create-stock-movement.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { StockMovementEntity } from '../entities/stock-movement.entity';
import { StockMovementsRepositoryInterface } from '../interfaces/stock-movements-repository.interface';

export class StockMovementsRepository implements StockMovementsRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Register an entry in the stock movement table, updating the product stock.
   * @param stockMovementDTO The data to be inserted in the stock movement table.
   * @returns The inserted stock movement and the updated product.
   */
  async registerEntry(stockMovementDTO: CreateStockMovementDto): Promise<StockMovementEntity> {
    return await this.prisma.$transaction(async (prisma) => {
      // First, update the product stock
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

      // Then, create a new stock movement
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

      // Return the inserted stock movement and the updated product
      return {
        ...stockMovement,
        product: productWithUpdatedStock,
      };
    });
  }

  /**
   * Register an exit in the stock movement table, updating the product stock.
   * @param stockMovementDTO The data to be inserted in the stock movement table.
   * @returns The inserted stock movement and the updated product.
   */
  async registerExit(stockMovementDTO: CreateStockMovementDto): Promise<StockMovementEntity> {
    return await this.prisma.$transaction(async (prisma) => {
      // First, update the product stock
      const productWithUpdatedStock = await prisma.product.update({
        where: {
          id: stockMovementDTO.product_id,
        },
        data: {
          stock: {
            // Decrement the stock by the quantity specified in the DTO
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

      // Then, create a new stock movement
      const stockMovement = await this.prisma.stockMovement.create({
        data: {
          // Copy the DTO and add the type 'decrease'
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

      // Return the inserted stock movement and the updated product
      return {
        ...stockMovement,
        product: productWithUpdatedStock,
      };
    });
  }

  /**
   * Get all stock movements filtered by the given conditional filters.
   * @param page the page of stock movements to get
   * @param limit the number of stock movements per page
   * @param orderBy the order of the stock movements (asc or desc)
   * @param conditionalFilters the filters to apply to the query
   * @returns an array of stock movements that match the given filters
   */
  async getMovements(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    conditionalFilters?: Prisma.StockMovementWhereInput,
  ): Promise<StockMovementEntity[]> {
    // Calculate the offset of the query
    const skip = (page - 1) * limit;

    // Execute the query and return the result
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
        },
      },
    });
  }

  /**
   * Count all stock movements that match the given conditional filters.
   * @param conditionalFilters The filters to apply to the stock movements query.
   * @returns A promise that resolves to the number of stock movements matching the filters.
   */
  async countAll(conditionalFilters: Prisma.StockMovementWhereInput): Promise<number> {
    // Use Prisma to count the stock movements that match the given filters
    return await this.prisma.stockMovement.count({
      where: conditionalFilters,
    });
  }
}
