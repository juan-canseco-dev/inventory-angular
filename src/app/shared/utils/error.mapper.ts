import {Error} from '../types/api.errors';
import { HttpErrorResponse } from '@angular/common/http';

export function toApiError(error: unknown): Error {
  const httpError = error as HttpErrorResponse;
  console.log(httpError);
  return {
    status: httpError.status ?? 0,
    message:
      httpError.error?.message ??
      httpError.message ??
      'An unexpected error occurred.',
    errors: httpError.error?.errors ?? null
  };
}
