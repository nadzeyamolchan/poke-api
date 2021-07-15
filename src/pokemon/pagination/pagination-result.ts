import { Expose } from 'class-transformer';

export class PaginationResult<T> {
  constructor(partial: Partial<PaginationResult<T>>) {
    Object.assign(this, partial);
  }
  @Expose()
  total?: number;
  @Expose()
  data: T[];
}
