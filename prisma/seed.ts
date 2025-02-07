// src/prisma/seed.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { HashProvider } from '../src/shared/providers/hash-provider';
import { RemoveAccents } from '../src/shared/utils/remove-accents';
const prisma = new PrismaClient();

/**
 * Function to seed the database with initial data.
 *
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  const hashProvider = new HashProvider();
  const removeAccents = new RemoveAccents();
  // Criar as permissões iniciais dos tipos de usuários
  await prisma.role.createMany({
    data: [
      {
        name: 'Administrador',
        name_unaccented: removeAccents.execute('Administrador'),
      },
      {
        name: 'Vendedor',
        name_unaccented: removeAccents.execute('Vendedor'),
      },
    ],
  });

  const hashedPassword = await hashProvider.generateHash('Teste12!@');

  const adminUser: Prisma.UserCreateInput = {
    first_name: 'John',
    first_name_unaccented: removeAccents.execute('John'),
    last_name: 'Admin',
    last_name_unaccented: removeAccents.execute('Admin'),
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
    first_name_unaccented: removeAccents.execute('John'),
    last_name: 'Vendedor',
    last_name_unaccented: removeAccents.execute('Vendedor'),
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
  });

  await prisma.user.create({
    data: sellerUser,
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
