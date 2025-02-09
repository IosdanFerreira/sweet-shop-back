import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { SupplierRepository } from './repositories/supplier.repository';

@Module({
  imports: [SharedModule],
  controllers: [SupplierController],
  providers: [
    SupplierService,
    PrismaService,
    {
      provide: 'SupplierRepositoryInterface',
      useFactory: (
        prismaService: PrismaService,
        removeAccents: RemoveAccentsInterface,
      ) => {
        return new SupplierRepository(prismaService, removeAccents);
      },
      inject: [PrismaService, 'RemoveAccentsInterface'],
    },
  ],
  exports: [SupplierService],
})
export class SupplierModule {}
