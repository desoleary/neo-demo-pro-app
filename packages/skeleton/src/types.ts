export type PaginationInput = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  orderBy?: {
    field: string;
    order: 'ASC' | 'DESC';
    direction?: 'ASC' | 'DESC';
  };
};

export type PaginationArgs = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
};