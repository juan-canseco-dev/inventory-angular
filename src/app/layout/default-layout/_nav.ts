import { INavData } from '@coreui/angular';
import { PermissionCatalog } from '../../core/permissions';


export interface INavDataWithPermissions extends INavData {
  permission?: string;
}

export const defaultNavItems: INavDataWithPermissions[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    permission: PermissionCatalog.Dashboard_View
  },
  {
    title: true,
    name: 'Catalog',

  },
  {
    name: 'Category',
    url: '/categories',
    iconComponent: { name: 'cilTags' },
    permission: PermissionCatalog.Categories_View
  },
  {
    name: 'Units Of Measurement',
    url: '/units',
    iconComponent: { name: 'cilList' },
    permission: PermissionCatalog.Units_View
  },
  {
    name: 'Products',
    url: '/products',
    iconComponent: { name: 'cil-clipboard' },
    permission: PermissionCatalog.Products_View
  },
  {
    name: 'Inventory',
    title: true
  },
  {
    name: 'Suppliers',
    url: '/suppliers',
    iconComponent: { name: 'cilTruck' },
    permission: PermissionCatalog.Suppliers_View
  },
  {
    name: 'Customers',
    url: '/customers',
    iconComponent: {name: 'cilUserFollow' },
    permission: PermissionCatalog.Customers_View
  },
  {
    name: 'Purchases',
    url: '/purchases',
    iconComponent: { name: 'cilBasket' },
    permission: PermissionCatalog.Purchases_View
  },
  {
    name: 'Orders',
    url: '/orders',
    iconComponent: { name: 'cilCart' },
    permission: PermissionCatalog.Orders_View
  },
  {
    name: 'Users & Roles',
    title: true
  },
  {
    name: 'Users',
    url: '/users',
    iconComponent: { name: 'cilUserPlus' },
    permission: PermissionCatalog.Users_View
  },
  {
    name: 'Roles',
    url: '/roles',
    iconComponent: { name: 'cilPeople' },
    permission: PermissionCatalog.Roles_View
  }
];
