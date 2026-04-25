import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreatePurchaseRequest,
  GetPurchasesRequest,
  Purchase,
  PurchaseDetails,
  UpdatePurchaseRequest
} from '../models';
import { Error, PagedList } from '../../../shared/types';

export const PurchasesActions = createActionGroup({
  source: 'Purchases',
  events: {
    'Load Page': props<{ request: GetPurchasesRequest }>(),
    'Load Page Success': props<{ page: PagedList<Purchase> }>(),
    'Load Page Failure': props<{ error: Error }>(),

    'Load Purchase Details': props<{ purchaseId: number }>(),
    'Load Purchase Details Success': props<{ details: PurchaseDetails }>(),
    'Load Purchase Details Failure': props<{ error: Error }>(),
    'Reset Purchase Details State': emptyProps(),

    'Create Purchase': props<{ request: CreatePurchaseRequest }>(),
    'Create Purchase Success': props<{ purchaseId: number }>(),
    'Create Purchase Failure': props<{ error: Error }>(),
    'Reset Create Purchase State': emptyProps(),

    'Update Purchase': props<{ request: UpdatePurchaseRequest }>(),
    'Update Purchase Success': emptyProps(),
    'Update Purchase Failure': props<{ error: Error }>(),
    'Reset Update Purchase State': emptyProps(),

    'Delete Purchase': props<{ purchaseId: number }>(),
    'Delete Purchase Success': emptyProps(),
    'Delete Purchase Failure': props<{ error: Error }>(),
    'Reset Delete Purchase State': emptyProps()
  }
});
