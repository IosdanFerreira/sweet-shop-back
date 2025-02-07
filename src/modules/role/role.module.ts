import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleRepository } from './repositories/role.repository';
import { RemoveAccents } from 'src/shared/utils/remove-accents';
import { SharedModule } from 'src/shared/modules/shared-module.module';

@Module({
  imports: [SharedModule],
  controllers: [RoleController],
  providers: [
    RoleService,
    PrismaService,
    {
      provide: 'RoleRepositoryInterface',
      useFactory: (
        prismaService: PrismaService,
        removeAccents: RemoveAccents,
      ) => {
        return new RoleRepository(prismaService, removeAccents);
      },
      inject: [PrismaService],
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
