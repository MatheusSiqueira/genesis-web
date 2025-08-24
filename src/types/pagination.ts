// src/types/pagination.ts
export type PageResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
