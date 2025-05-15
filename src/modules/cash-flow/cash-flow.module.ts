import { Module } from '@nestjs/common';
import { CashFlowService } from './cash-flow.service';
import { CashFlowController } from './cash-flow.controller';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CashFlowRepository } from './repositories/cash-flow.repository';

@Module({
  imports: [SharedModule],
  controllers: [CashFlowController],
  providers: [
    CashFlowService,
    PrismaService,
    {
      provide: 'CashFlowRepositoryInterface',
      useFactory: (prismaService: PrismaService) => {
        return new CashFlowRepository(prismaService);
      },
      inject: [PrismaService],
    },
  ],
  exports: [CashFlowService],
})
export class CashFlowModule { }
