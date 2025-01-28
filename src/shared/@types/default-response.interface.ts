import { IPagination } from './pagination.interface';

export interface errorProps {
  property: string;
  message: string;
}

export interface IDefaultResponse<T> {
  status_code: number;
  success: boolean;
  message: string;
  data: T;
  pagination: IPagination | null;
  errors: errorProps[] | null;
  error_type: string | null;
}
