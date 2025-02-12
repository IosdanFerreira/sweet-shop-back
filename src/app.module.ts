import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/auth/guards/jwt-auth.guard';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoryModule } from './modules/category/category.module';
import { SharedModule } from './shared/modules/shared-module.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { StockMovementsModule } from './modules/stock-movements/stock-movements.module';
import { SaleModule } from './modules/sale/sale.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    RoleModule,
    ProductsModule,
    CategoryModule,
    SharedModule,
    SupplierModule,
    StockMovementsModule,
    SaleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
