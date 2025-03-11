import { INavData } from '@coreui/angular';
import { Permissions } from '../../core/models/permissions';


export interface INavDataWithPermissions extends INavData {
  permission?: string;
}

export const navItems: INavDataWithPermissions[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    permission: Permissions.Dashboard_View
  },
  {
    title: true,
    name: 'Catalog',
 
  },
  {
    name: 'Category',
    url: '/categories',
    iconComponent: { name: 'cilTags' },
    permission: Permissions.Categories_View
  },
  {
    name: 'Units Of Measurement',
    url: '/units',
    iconComponent: { name: 'cilList' },
    permission: Permissions.Units_View
  },
  {
    name: 'Products',
    url: '/products',
    iconComponent: { name: 'cil-clipboard' },
    permission: Permissions.Products_View
  },
  {
    name: 'Inventory',
    title: true
  },
  {
    name: 'Suppliers',
    url: '/suppliers',
    iconComponent: { name: 'cilTruck' },
    permission: Permissions.Suppliers_View
  },
  {
    name: 'Purchases',
    url: '/purchases',
    iconComponent: { name: 'cilBasket' },
    permission: Permissions.Purchases_View
  },
  {
    name: 'Orders',
    url: '/orders',
    iconComponent: { name: 'cilCart' },
    permission: Permissions.Orders_View 
  },
  {
    name: 'Users & Roles',
    title: true
  },
  {
    name: 'Users',
    url: '/users',
    iconComponent: { name: 'cilUserPlus' },
    permission: Permissions.Users_View
  },
  {
    name: 'Roles',
    url: '/roles',
    iconComponent: { name: 'cilPeople' },
    permission: Permissions.Roles_View
  }
];
