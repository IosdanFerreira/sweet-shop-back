import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoryModule } from './modules/category/category.module';
import { SharedModule } from './shared/modules/shared-module.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { StockMovementsModule } from './modules/stock-movements/stock-movements.module';
import { SaleModule } from './modules/sale/sale.module';
import { ReportModule } from './modules/report/report.module';
import { CashFlowModule } from './modules/cash-flow/cash-flow.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 30,
        },
      ],
    }),
    ConfigModule.forRoot(),
    UserModule,
    RoleModule,
    ProductsModule,
    CategoryModule,
    SharedModule,
    SupplierModule,
    StockMovementsModule,
    SaleModule,
    ReportModule,
    CashFlowModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
    PrismaService,
  ],
})
export class AppModule {}
