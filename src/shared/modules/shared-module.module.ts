import { Module } from '@nestjs/common';
import { RemoveAccents } from '../utils/remove-accents';
import { HashProvider } from '../providers/hash-provider';
import { Pagination } from '../utils/pagination.utils';

@Module({
  providers: [
    {
      provide: 'RemoveAccentsInterface',
      useClass: RemoveAccents,
    },
    {
      provide: 'HashProviderInterface',
      useClass: HashProvider,
    },
    {
      provide: 'PaginationInterface',
      useClass: Pagination,
    },
  ],
  exports: [
    'RemoveAccentsInterface',
    'HashProviderInterface',
    'PaginationInterface',
  ],
})
export class SharedModule {}
