import { PrismaService } from 'src/prisma/prisma.service';
import { SalesRepositoryInterface } from '../interfaces/sales-repository.interface';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleEntity } from '../entities/sale.entity';
import { SaleItemEntity } from '../entities/sale-item.entity';
import { NotFoundError } from 'src/shared/errors/types/not-found.error';
import { BadRequestError } from 'src/shared/errors/types/bad-request.error';

export class SalesRepository implements SalesRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Registra uma nova compra
   *
   * @param {CreateSaleDto[]} createSaleDto
   * @returns {Promise<SaleEntity>}
   */
  async registerSale(createSaleDto: CreateSaleDto[]): Promise<SaleEntity> {
    return await this.prisma.$transaction(async (prisma) => {
      // Variáveis que armazena o total da compra
      let totalSalePrice = 0;

      // Variável que armazena todos os itens da compra
      const saleItems: SaleItemEntity[] = [];

      // Verifica se os produtos existem e calcula o subtotal por produto, somando ao valor total da compra
      await Promise.all(
        createSaleDto.map(async (product) => {
          // Checa se o produto existe
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

          // Se o produto não existir, retorna um erro para o produto específico não encontrado
          if (!productAlreadyExists) {
            throw new NotFoundError([
              { property: null, message: `Produto com o ID ${product.product_id} não encontrado` },
            ]);
          }

          // Se a quantidade de produtos desejados for maior que a quantidade em estoque, retorna um erro
          if (product.quantity > productAlreadyExists.stock) {
            throw new BadRequestError([
              {
                property: null,
                message: `Quantidade de itens desejados excede a quantidade em estoque do produto com ID ${product.product_id}`,
              },
            ]);
          }

          // Calcula o subtotal da compra por produto
          const subtotal = productAlreadyExists.selling_price * product.quantity;

          // Adiciona o subtotal por produto ao valor total final da compra
          totalSalePrice += subtotal;
        }),
      );

      // Cria um registro da compra do banco
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
          // Checa se o produto existe
          const productAlreadyExists = await prisma.product.findUnique({
            where: {
              id: item.product_id,
              deleted: false,
            },
            select: { selling_price: true },
          });

          //  Cria o item da compra
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

          // Registra a movimentação de estoque para p produto atual
          await prisma.stockMovement.create({
            data: {
              product_id: item.product_id,
              quantity: item.quantity,
              type: 'decrease',
            },
          });

          // Atualiza o estoque do produto diminuindo de acordo com a quantidade que foi comprada
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
                  created_at: true,
                  updated_at: true,
                },
              },
              deleted: false,
              created_at: true,
              updated_at: true,
            },
          });

          // Adiciona o item da compra ao array
          saleItems.push({ ...saleItem, product: productWithUpdatedStock });
        }),
      );

      return { ...sale, items: saleItems };
    });
  }

  async getAllSales(page: number, limit: number, orderBy: 'asc' | 'desc' = 'desc'): Promise<SaleEntity[]> {
    const skip = (page - 1) * limit;

    return await this.prisma.sale.findMany({
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
}
