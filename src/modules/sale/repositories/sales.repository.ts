import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SalesRepositoryInterface } from '../interfaces/sales-repository.interface';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleEntity } from '../entities/sale.entity';
import { SaleItemEntity } from '../entities/sale-item.entity';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class SalesRepository implements SalesRepositoryInterface {
  constructor(
    private readonly prisma: PrismaService,

    @Inject('RemoveAccentsInterface')
    private readonly removeAccents: RemoveAccentsInterface,
  ) {}

  /**
   * Registers a new sale
   *
   * @param {CreateSaleDto[]} createSaleDto
   * @returns {Promise<SaleEntity>}
   */
  async register(createSaleDto: CreateSaleDto[]): Promise<SaleEntity> {
    return await this.prisma.$transaction(async (prisma) => {
      // Variables that store the total price of the sale
      let totalSalePrice = 0;

      // Variable that stores all the items of the sale
      const saleItems: SaleItemEntity[] = [];

      // Checks if the products exist and calculates the subtotal by product, adding to the total price of the sale
      await Promise.all(
        createSaleDto.map(async (product) => {
          // Checks if the product exists
          const productAlreadyExists = await prisma.product.findUnique({
            where: {
              id: product.product_id,
              deleted: false,
            },
            select: {
              selling_price: true,
              stock: true,
            },
          });

          // If the product does not exist, returns an error for the product not found
          if (!productAlreadyExists) {
            throw new NotFoundError('Error when searching for product', [
              { property: null, message: `Product with ID ${product.product_id} not found` },
            ]);
          }

          // If the quantity of products desired is greater than the quantity in stock, returns an error
          if (product.quantity > productAlreadyExists.stock) {
            throw new BadRequestError('Error when storing products', [
              {
                property: null,
                message: `Quantity of items desired exceeds the quantity in stock of the product with ID ${product.product_id}`,
              },
            ]);
          }

          // Calculates the subtotal of the sale by product
          const subtotal = productAlreadyExists.selling_price * product.quantity;

          // Adds the subtotal by product to the total price of the sale
          totalSalePrice += subtotal;
        }),
      );

      // Creates a record of the sale in the database
      const sale = await prisma.sale.create({
        data: { total: totalSalePrice },
        select: {
          id: true,
          total: true,
          deleted: false,
          created_at: true,
          updated_at: true,
          items: true,
        },
      });

      // Create sale items and decrement the product stock
      await Promise.all(
        createSaleDto.map(async (item) => {
          // Checks if the product exists
          const productAlreadyExists = await prisma.product.findUnique({
            where: {
              id: item.product_id,
              deleted: false,
            },
            select: { selling_price: true },
          });

          //  Creates the item of the sale
          const saleItem = await prisma.saleItem.create({
            data: {
              sale_id: sale.id,
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price: productAlreadyExists.selling_price,
              subtotal: productAlreadyExists.selling_price * item.quantity,
            },
            select: {
              quantity: true,
              unit_price: true,
              subtotal: true,
              created_at: true,
              updated_at: true,
              product: false,
            },
          });

          // Registers the stock movement for the product
          await prisma.stockMovement.create({
            data: {
              product_id: item.product_id,
              quantity: item.quantity,
              type: 'decrease',
            },
          });

          // Updates the product stock decreasing by the quantity that was bought
          const productWithUpdatedStock = await prisma.product.update({
            where: {
              id: item.product_id,
              deleted: false,
            },
            data: {
              stock: { decrement: item.quantity },
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

          // Adds the item of the sale to the array
          saleItems.push({ ...saleItem, product: productWithUpdatedStock });
        }),
      );

      return { ...sale, items: saleItems };
    });
  }

  /**
   * Find all sales that match the given filters.
   * @param page The page of the pagination.
   * @param limit The limit of items per page.
   * @param orderBy The order of the items, either 'asc' or 'desc'.
   * @param conditionalFilters The filters to apply to the query.
   * @returns An array of sales that match the given filters.
   */
  async findAll(
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
    conditionalFilters: Prisma.SaleWhereInput,
  ): Promise<SaleEntity[]> {
    const skip = (page - 1) * limit;

    return await this.prisma.sale.findMany({
      where: conditionalFilters,
      skip,
      take: limit,
      orderBy: {
        id: orderBy,
      },
      select: {
        id: true,
        total: true,
        created_at: true,
        updated_at: true,
        items: {
          select: {
            quantity: true,
            unit_price: true,
            subtotal: true,
            product: {
              select: {
                id: true,
                name: true,
                description: true,
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
                created_at: true,
                updated_at: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Counts all sales that match the given filters.
   * @param conditionalFilters The filters to apply to the query.
   * @returns A promise that resolves to the number of sales matching the filters.
   */
  async countAll(conditionalFilters?: Prisma.SaleWhereInput): Promise<number> {
    // Use Prisma to count the sales that match the given filters
    return await this.prisma.sale.count({
      // Apply the filters to the query
      where: conditionalFilters,
    });
  }
}
