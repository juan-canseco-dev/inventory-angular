import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateProductRequest,
  GetProductsRequest,
  Product,
  ProductDetails,
  UpdateProductRequest
} from '../models';
import { Error, PagedList } from '../../../shared/types';

export const ProductsActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Page': props<{ request: GetProductsRequest }>(),
    'Load Page Success': props<{ page: PagedList<Product> }>(),
    'Load Page Failure': props<{ error: Error }>(),

    'Load Product Details': props<{ productId: number }>(),
    'Load Product Details Success': props<{ details: ProductDetails }>(),
    'Load Product Details Failure': props<{ error: Error }>(),
    'Reset Product Details State': emptyProps(),

    'Create Product': props<{ request: CreateProductRequest }>(),
    'Create Product Success': props<{ productId: number }>(),
    'Create Product Failure': props<{ error: Error }>(),
    'Reset Create Product State': emptyProps(),

    'Update Product': props<{ request: UpdateProductRequest }>(),
    'Update Product Success': emptyProps(),
    'Update Product Failure': props<{ error: Error }>(),
    'Reset Update Product State': emptyProps(),

    'Delete Product': props<{ productId: number }>(),
    'Delete Product Success': emptyProps(),
    'Delete Product Failure': props<{ error: Error }>(),
    'Reset Delete Product State': emptyProps()
  }
});
