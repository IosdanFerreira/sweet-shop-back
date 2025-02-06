import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleRepository } from './repositories/role.repository';

@Module({
  controllers: [RoleController],
  providers: [
    RoleService,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'RoleRepositoryInterface',
      useFactory: (prismaService: PrismaService) => {
        return new RoleRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
