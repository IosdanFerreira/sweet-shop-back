import { ConflictError } from './conflict.error';
import { PrismaClientError } from './prisma-client.error';

export class UniqueConstraintError extends ConflictError {
  constructor(prismaClient: PrismaClientError) {
    const uniqueField = prismaClient.meta.target;

    super([
      {
        property: `${uniqueField}`,
        message: `Um registro com esse ${uniqueField} já existe!`,
      },
    ]);
  }
}
