export class SupplierEntity {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  created_at: Date;
  updated_at: Date;
}
