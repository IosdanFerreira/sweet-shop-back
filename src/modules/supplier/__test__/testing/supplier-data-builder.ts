import { SupplierEntity } from '../../entities/supplier.entity';

export function SupplierDataBuilder(supplier?: SupplierEntity): SupplierEntity {
  return {
    id: supplier?.id ?? 1,
    name: supplier?.name ?? 'Test Supplier',
    phone: supplier?.phone ?? '(11) 11222-3344',
    email: supplier?.email ?? 'test@example.com',
    created_at: new Date(),
    updated_at: new Date(),
  };
}
