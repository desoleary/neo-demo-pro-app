// src/__tests__/support/types/graphql.ts

import type { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';

// Safe generic version matching Apollo
export type GraphQLSingleResponse<TData> = {
  kind: 'single';
  singleResult: ExecutionResult<TData, ObjMap<unknown>>;
};