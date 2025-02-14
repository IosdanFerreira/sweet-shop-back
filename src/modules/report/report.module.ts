import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportRepository } from './repositories/report.repository';
import { ProductsModule } from '../products/products.module';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [SharedModule, ProductsModule, SupplierModule],
  controllers: [ReportController],
  providers: [
    ReportService,
    PrismaService,
    {
      provide: 'ReportRepositoryInterface',
      useFactory: (prismaService: PrismaService) => new ReportRepository(prismaService),
      inject: [PrismaService],
    },
  ],
  exports: [ReportService],
})
export class ReportModule {}
