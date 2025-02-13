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
    iconComponent: { name: 'cilTags' }
  },
  {
    name: 'Units Of Measurement',
    url: '/units',
    iconComponent: { name: 'cilList' }
  },
  {
    name: 'Products',
    url: '/products',
    iconComponent: { name: 'cil-clipboard' }
  },
  {
    name: 'Inventory',
    title: true
  },
  {
    name: 'Suppliers',
    url: '/suppliers',
    iconComponent: { name: 'cilTruck' }
  },
  {
    name: 'Purchases',
    url: '/purchases',
    iconComponent: { name: 'cilBasket' }
  },
  {
    name: 'Orders',
    url: '/orders',
    iconComponent: { name: 'cilCart' }
  },
  {
    name: 'Users & Roles',
    title: true
  },
  {
    name: 'Users',
    url: '/users',
    iconComponent: { name: 'cilUserPlus' }
  },
  {
    name: 'Roles',
    url: '/roles',
    iconComponent: { name: 'cilPeople' }
  },
];
