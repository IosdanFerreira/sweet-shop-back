import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ProductRepository } from './repositories/product.repository';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { CategoryModule } from '../category/category.module';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [SharedModule, CategoryModule, SupplierModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    {
      provide: 'ProductRepositoryInterface',
      useFactory: (prismaService: PrismaService, removeAccents: RemoveAccentsInterface) => {
        return new ProductRepository(prismaService, removeAccents);
      },
      inject: [PrismaService, 'RemoveAccentsInterface'],
    },
  ],
  exports: [ProductsService],
})
export class ProductsModule { }
