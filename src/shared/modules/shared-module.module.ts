import { Module } from '@nestjs/common';
import { RemoveAccents } from '../utils/remove-accents';
import { HashProvider } from '../providers/hash-provider';
import { Pagination } from '../utils/pagination.utils';
import { FormatDateInUsa } from '../utils/format-date-in-usa';

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
    {
      provide: 'FormatDateInUsaInterface',
      useClass: FormatDateInUsa,
    },
  ],
  exports: ['RemoveAccentsInterface', 'HashProviderInterface', 'PaginationInterface', 'FormatDateInUsaInterface'],
})
export class SharedModule {}
