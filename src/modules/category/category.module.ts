import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './repositories/category.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { SharedModule } from 'src/shared/modules/shared-module.module';

@Module({
  imports: [SharedModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    PrismaService,
    {
      provide: 'CategoryRepositoryInterface',
      useFactory: (prismaService: PrismaService, removeAccents: RemoveAccentsInterface) => {
        return new CategoryRepository(prismaService, removeAccents);
      },
      inject: [PrismaService, 'RemoveAccentsInterface'],
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
