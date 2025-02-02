// src/prisma/seed.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { HashProvider } from '../src/shared/providers/hash-provider/hash-provider';
const prisma = new PrismaClient();

/**
 * Function to seed the database with initial data.
 *
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  const hashProvider = new HashProvider();
  // Criar as permissões iniciais dos tipos de usuários
  await prisma.role.createMany({
    data: [
      {
        role_name: 'Administrador',
      },
      {
        role_name: 'Vendedor',
      },
    ],
  });

  const hashedPassword = await hashProvider.generateHash('123456');

  const adminUser: Prisma.UserCreateInput = {
    first_name: 'John',
    last_name: 'Admin',
    email: 'johnAdmin@example.com',
    password: hashedPassword,
    phone: '(11) 99999-9999',
    privacy_consent: true,
    role: {
      connect: {
        id: 1, // ID da permissão de administrador
      },
    },
  };

  const sellerUser: Prisma.UserCreateInput = {
    first_name: 'John',
    last_name: 'Vendedor',
    email: 'johnVendedor@example.com',
    password: hashedPassword,
    phone: '(11) 99999-9999',
    privacy_consent: true,
    role: {
      connect: {
        id: 2, // ID da permissão de vendedor
      },
    },
  };

  await prisma.user.create({
    data: adminUser,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      password: false,
      phone: true,
      address: true,
      privacy_consent: true,
      deleted: false,
      created_at: true,
      updated_at: true,
    },
  });

  await prisma.user.create({
    data: sellerUser,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      password: false,
      phone: true,
      address: true,
      privacy_consent: true,
      deleted: false,
      created_at: true,
      updated_at: true,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
