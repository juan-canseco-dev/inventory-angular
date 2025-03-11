import { Component, inject, input, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { AuthService } from '../../core/services/auth';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ContainerComponent,
  INavData,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { Permissions } from '../../core/models/permissions';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { INavDataWithPermissions, navItems } from './_nav';
import { UserDetails } from '../../core/models/auth';
import { NgStyle } from '@angular/common';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss'],
    imports: [
        SidebarComponent,
        SidebarHeaderComponent,
        SidebarBrandComponent,
        RouterLink,
        IconDirective,
        NgScrollbar,
        SidebarNavComponent,
        SidebarFooterComponent,
        SidebarToggleDirective,
        SidebarTogglerDirective,
        DefaultHeaderComponent,
        ShadowOnScrollDirective,
        ContainerComponent,
        RouterOutlet,
        DefaultFooterComponent,
        ModalBodyComponent,
        ModalComponent,
        ModalFooterComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ButtonCloseDirective,
        ButtonDirective
    ]
})
export class DefaultLayoutComponent {


  private permissions : string[] =  [
    Permissions.Dashboard_View,
    Permissions.Categories_View,
    Permissions.Products_View,
    Permissions.Suppliers_View,
    Permissions.Units_View,
    Permissions.Customers_View,
    Permissions.Orders_View,
    Permissions.Purchases_View,
    Permissions.Users_View,
    Permissions.Roles_View
  ];

  public navItems : INavDataWithPermissions[] = navItems;

  showLogOutModal = false;
  
  authService = inject(AuthService);

  userDetails !: UserDetails;

  constructor() {
    this.userDetails = this.authService.getUser();
    this.permissions = this.permissions.filter(p => this.userDetails.permissions.includes(p));
    this.navItems = this.navItems.filter(item => {
      if (!item.permission) return true;
      return this.permissions.includes(item.permission);
    });

  }

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }

  onLogOut(event : any) {
    this.showLogOutModal = true;
  }

  onLogOutCancel() {
    this.showLogOutModal = false;
  }

  onLogOutConfirm() {
    this.showLogOutModal = true;
    this.authService.logOut();
  }
}
