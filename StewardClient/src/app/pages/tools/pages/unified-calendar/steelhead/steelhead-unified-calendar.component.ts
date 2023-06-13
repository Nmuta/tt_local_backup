import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { MatRoutedTabData } from '@models/mat-routed-tab-data';
import { find, includes } from 'lodash';
import { filter, takeUntil } from 'rxjs';

/** Displays the Steward Steelhead Unified Calendar tools. */
@Component({
  templateUrl: './steelhead-unified-calendar.component.html',
  styleUrls: ['./steelhead-unified-calendar.component.scss'],
})
export class SteelheadUnifiedCalendarComponent extends BaseComponent implements OnInit {
  public gameTitle: GameTitle = GameTitle.FM8;
  public tabs: MatRoutedTabData[] = [
    {
      name: "Racer's Cup Calendar",
      path: `/racers-cup-calendar`,
    },
    {
      name: "Builder's Cup Calendar",
      path: `/builders-cup-calendar`,
    },
    {
      name: 'Welcome Center Calendar',
      path: `/welcome-center-calendar`,
    },
    {
      name: 'Rivals Calendar',
      path: `/rivals-calendar`,
    },
    {
      name: 'Showroom Calendar',
      path: `/showroom-calendar`,
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
