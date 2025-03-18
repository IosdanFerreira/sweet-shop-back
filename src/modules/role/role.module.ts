import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RemoveAccents } from 'src/shared/utils/remove-accents';
import { RoleController } from './role.controller';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from './role.service';
import { SharedModule } from 'src/shared/modules/shared-module.module';

@Module({
  imports: [SharedModule],
  controllers: [RoleController],
  providers: [
    RoleService,
    PrismaService,
    {
      provide: 'RoleRepositoryInterface',
      useFactory: (prismaService: PrismaService, removeAccents: RemoveAccents) => {
        return new RoleRepository(prismaService, removeAccents);
      },
      inject: [PrismaService],
    },
  ],
  exports: [RoleService],
})
export class RoleModule {}
