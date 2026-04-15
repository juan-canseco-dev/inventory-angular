import { AuthActions, PermissionsFacade, selectAuthUser } from '../../core/auth/store';
import { Component, effect, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { Store } from '@ngrx/store';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ContainerComponent,
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
import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { INavDataWithPermissions, defaultNavItems } from './_nav';

@Component({
    selector: 'app-dashboard',
    templateUrl: './default-layout.component.html',
    styleUrls: ['./default-layout.component.scss'],
    imports: [
        SidebarComponent,
        SidebarHeaderComponent,
        SidebarBrandComponent,
        RouterLink,
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

  public navItems : INavDataWithPermissions[] = defaultNavItems;

  showSignOutModal = false;

  private readonly store = inject(Store);
  private readonly permissionsFacade = inject(PermissionsFacade);

  readonly user = this.store.selectSignal(selectAuthUser);
  readonly userPermissions = this.permissionsFacade.permissions;

  constructor() {
      effect(() => {
      this.navItems = defaultNavItems.filter(item => {
        if (!item.permission) return true;
        return this.permissionsFacade.hasPermission(item.permission);
      });
    });
  }

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }

  onSignOutClick(event : any) {
    this.showSignOutModal = true;
  }

  onSignOutCancelClick() {
    this.showSignOutModal = false;
  }

  onSignOutConfirmed() {
    this.showSignOutModal = true;
    this.store.dispatch(AuthActions.signOut());
  }
}
