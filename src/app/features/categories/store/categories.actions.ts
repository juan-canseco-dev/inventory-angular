import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Category,
  CreateCategoryRequest,
  GetCategoriesRequest,
  UpdateCategoryRequest
} from '../models';
import { PagedList, Error } from '../../../shared/types';

export const CategoriesActions = createActionGroup({
  source: 'Categories',
  events: {
    'Load Page': props<{ request: GetCategoriesRequest }>(),
    'Load Page Success': props<{ page: PagedList<Category> }>(),
    'Load Page Failure': props<{ error: Error }>(),

    'Create Category': props<{ request: CreateCategoryRequest }>(),
    'Create Category Success': props<{ categoryId: number }>(),
    'Create Category Failure': props<{ error: Error }>(),
    'Reset Create Category State': emptyProps(),

    'Update Category': props<{ request: UpdateCategoryRequest }>(),
    'Update Category Success': emptyProps(),
    'Update Category Failure': props<{ error: Error }>(),
    'Reset Update Category State': emptyProps(),

    'Delete Category': props<{ categoryId: number }>(),
    'Delete Category Success': emptyProps(),
    'Delete Category Failure': props<{ error: Error }>(),
    'Reset Delete Category State': emptyProps()
  }
});
