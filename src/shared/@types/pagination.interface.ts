export interface IPagination {
  total_items: number;
  limit_per_page: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  total_pages: number;
}
