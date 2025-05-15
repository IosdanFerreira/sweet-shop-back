import { Module } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { SupplierController } from './supplier.controller';
import { SupplierRepository } from './repositories/supplier.repository';
import { SupplierService } from './supplier.service';

@Module({
  imports: [SharedModule],
  controllers: [SupplierController],
  providers: [
    SupplierService,
    PrismaService,
    {
      provide: 'SupplierRepositoryInterface',
      useFactory: (prismaService: PrismaService, removeAccents: RemoveAccentsInterface) => {
        return new SupplierRepository(prismaService, removeAccents);
      },
      inject: [PrismaService, 'RemoveAccentsInterface'],
    },
  ],
  exports: [SupplierService],
})
export class SupplierModule { }
