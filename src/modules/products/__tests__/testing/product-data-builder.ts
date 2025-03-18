import { ProductEntity } from '../../entities/product.entity';

/**
 * Class that helps to create a {@link ProductEntity} with default values.
 */
export function ProductDataBuilder(product?: Partial<ProductEntity>): ProductEntity {
  return {
    /**
     * The product id. If not provided, defaults to 1.
     */
    id: product?.id ?? 1,
    /**
     * The product name. If not provided, defaults to "Produto 1".
     */
    name: product?.name ?? 'Produto 1',
    /**
     * The product description. If not provided, defaults to null.
     */
    description: product?.description ?? null,
    /**
     * The product purchase price. If not provided, defaults to 650.
     */
    purchase_price: product?.purchase_price ?? 650,
    /**
     * The product selling price. If not provided, defaults to 1000.
     */
    selling_price: product?.selling_price ?? 1000,
    /**
     * The product stock. If not provided, defaults to 9620.
     */
    stock: product?.stock ?? 9620,
    /**
     * The product category. If not provided, defaults to
     * {
     *   id: 1,
     *   name: 'Cereais',
     *   created_at: new Date(),
     *   updated_at: new Date(),
     * }
     */
    category: {
      id: product?.category?.id ?? 1,
      name: product?.category?.name ?? 'Cereais',
      created_at: new Date(),
      updated_at: new Date(),
    },
    /**
     * The product supplier. If not provided, defaults to
     * {
     *   id: 1,
     *   name: 'Test Supplier',
     *   phone: '(11) 12345-6789',
     *   email: 'testSupplier@example.com',
     *   created_at: new Date(),
     *   updated_at: new Date(),
     * }
     */
    supplier: {
      id: product?.supplier?.id ?? 1,
      name: product?.supplier?.name ?? 'Test Supplier',
      phone: product?.supplier?.phone ?? '(11) 12345-6789',
      email: product?.supplier?.email ?? 'testSupplier@example.com',
      created_at: new Date(),
      updated_at: new Date(),
    },
    /**
     * The product creation date. If not provided, defaults to the current date.
     */
    created_at: new Date(),
    /**
     * The product update date. If not provided, defaults to the current date.
     */
    updated_at: new Date(),
  };
}
