import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalesRepository } from './repositories/sales.repository';

@Module({
  imports: [SharedModule],
  controllers: [SaleController],
  providers: [
    SaleService,
    PrismaService,
    {
      provide: 'SalesRepositoryInterface',
      useFactory: (prismaService: PrismaService) => {
        return new SalesRepository(prismaService);
      },
      inject: [PrismaService],
    },
  ],
  exports: [SaleService],
})
export class SaleModule {}
