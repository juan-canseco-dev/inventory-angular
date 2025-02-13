import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    title: true,
    name: 'Catalog'
  },
  {
    name: 'Category',
    url: '/categories',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Units Of Measurement',
    url: '/units',
    iconComponent: { name: 'cil-ruler' }
  },
  {
    name: 'Products',
    url: '/products',
    iconComponent: { name: 'cil-cart' }
  },
  {
    name: 'Inventory',
    title: true
  },
  {
    name: 'Suppliers',
    url: '/suppliers',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Purchases',
    url: '/purchases',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Orders',
    url: '/orders',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Users & Roles',
    title: true
  },
  {
    name: 'Users',
    url: '/users',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Roles',
    url: '/roles',
    iconComponent: { name: 'cil-drop' }
  },
];
