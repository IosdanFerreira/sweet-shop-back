import { Module } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { StockMovementsRepository } from './repositories/stock-movements.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [SharedModule, ProductsModule],
  controllers: [StockMovementsController],
  providers: [
    StockMovementsService,
    PrismaService,
    {
      provide: 'StockMovementsRepositoryInterface',
      useFactory: (prismaService: PrismaService) => {
        return new StockMovementsRepository(prismaService);
      },
      inject: [PrismaService],
    },
  ],
  exports: [StockMovementsService],
})
export class StockMovementsModule { }
