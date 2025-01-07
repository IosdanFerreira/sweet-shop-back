import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
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
