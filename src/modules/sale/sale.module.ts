import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalesRepository } from './repositories/sales.repository';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';

@Module({
  imports: [SharedModule],
  controllers: [SaleController],
  providers: [
    SaleService,
    PrismaService,
    {
      provide: 'SalesRepositoryInterface',
      useFactory: (prismaService: PrismaService, removeAccents: RemoveAccentsInterface) => {
        return new SalesRepository(prismaService, removeAccents);
      },
      inject: [PrismaService, 'RemoveAccentsInterface'],
    },
  ],
  exports: [SaleService],
})
export class SaleModule {}
