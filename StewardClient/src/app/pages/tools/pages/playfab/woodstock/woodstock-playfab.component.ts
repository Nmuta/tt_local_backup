import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { MatRoutedTabData } from '@models/mat-routed-tab-data';
import { find, includes } from 'lodash';
import { filter, takeUntil } from 'rxjs';

/** Displays the Steward Woodstock PlayFab tool. */
@Component({
  templateUrl: './woodstock-playfab.component.html',
  styleUrls: ['./woodstock-playfab.component.scss'],
})
export class WoodstockPlayFabComponent extends BaseComponent implements OnInit {
  public gameTitle: GameTitle = GameTitle.FH5;
  public tabs: MatRoutedTabData[] = [
    {
      name: 'PlayFab Builds',
      path: `/manage-builds`,
    },
    {
      name: 'PlayFab Settings',
      path: `/settings`,
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
