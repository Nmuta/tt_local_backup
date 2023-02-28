import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { MatRoutedTabData } from '@models/mat-routed-tab-data';
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
    },
  ];
  public activeTab: MatRoutedTabData;

  constructor(private readonly router: Router) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
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
