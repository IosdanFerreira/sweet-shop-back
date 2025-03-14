import { SupplierDataBuilder } from 'src/modules/supplier/__test__/testing/supplier-data-builder';

export function SaleDataBuilder() {
  return {
    id: 1,
    total: 100,
    created_at: new Date('2024-03-01T10:00:00Z'),
    updated_at: new Date('2024-03-01T12:00:00Z'),
    items: [
      {
        quantity: 2,
        unit_price: 25,
        subtotal: 50,
        product: {
          id: 10,
          name: 'Produto Teste 1',
          description: 'Descrição do produto 1',
          purchase_price: 15,
          selling_price: 25,
          stock: 100,
          category: {
            id: 1,
            name: 'Categoria A',
            created_at: new Date('2024-01-01'),
            updated_at: new Date('2024-01-10'),
          },
          supplier: SupplierDataBuilder(),
          created_at: new Date('2024-02-01'),
          updated_at: new Date('2024-02-05'),
        },
      },
    ],
  };
}
