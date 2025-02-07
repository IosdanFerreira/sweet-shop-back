import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SharedModule } from 'src/shared/modules/shared-module.module';

@Module({
  imports: [SharedModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    // {
    //   provide: 'ProductRepositoryInterface',
    //   useFactory: (prismaService: PrismaService) => {
    //     return new ProductRepository(prismaService);
    //   },
    //   inject: ['PrismaService'],
    // },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
