import { selectAuthPermissions, selectAuthUser, AuthActions  } from '../../core/auth/store';
import { AuthService } from '../../core/auth/service';
import { Store } from '@ngrx/store';
import { Component, inject, input, signal, effect } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
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
import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { INavDataWithPermissions, defaultNavItems } from './_nav';

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

  public navItems : INavDataWithPermissions[] = defaultNavItems;

  showSignOutModal = false;

  authService = inject(AuthService);
  private store = inject(Store);

  readonly user = this.store.selectSignal(selectAuthUser);
  readonly userPermissions = this.store.selectSignal(selectAuthPermissions);

  constructor() {
      effect(() => {
      const permissions = this.userPermissions();

      this.navItems = defaultNavItems.filter(item => {
        if (!item.permission) return true;
        return permissions.includes(item.permission);
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
