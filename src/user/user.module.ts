import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashProvider } from 'src/shared/providers/hash-provider/hash-provider';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'HashProviderInterface',
      useClass: HashProvider,
    },
    {
      provide: 'UserRepositoryInterface',
      useFactory: (prismaService: PrismaService) => {
        return new UserRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
  ],
})
export class UserModule {}
