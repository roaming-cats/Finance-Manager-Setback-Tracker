import { Request } from "express";

export type ValidatedRequest<TQuery = unknown, TBody = unknown, TParams = unknown> =
  Request & {
    validatedQuery?: TQuery;
    validatedBody?: TBody;
    validatedParams?: TParams;
  };
