import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { UserRole } from '@models/enums';
import { MatRoutedTabData } from '@models/mat-routed-tab-data';
import { UserModel } from '@models/user.model';
import { Store } from '@ngxs/store';
import { UserState } from '@shared/state/user/user.state';
import { find, includes } from 'lodash';
import { filter, takeUntil } from 'rxjs';

/** Displays the Steward permission management tool. */
@Component({
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.scss'],
})
export class PermissionManagementComponent extends BaseComponent implements OnInit {
  public tabs: MatRoutedTabData[] = [
    {
      name: 'Manage User Permissions',
      path: `/users`,
    },
    {
      name: 'Manage Teams',
      path: `/teams`,
      hide: true,
    },
  ];
  public activeTab: MatRoutedTabData;

  constructor(private readonly router: Router, private readonly store: Store) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    if (user.role === UserRole.LiveOpsAdmin) {
      this.tabs.map(tab => {
        tab.hide = false;
        return tab;
      });
    }

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.onDestroy$),
      )
      .subscribe((event: NavigationEnd) => {
        this.setActiveTab(event.url);
      });

    this.setActiveTab(this.router.url);
  }

  private setActiveTab(url: string): void {
    this.activeTab = find(this.tabs, tab => includes(url, tab.path));
  }
}
