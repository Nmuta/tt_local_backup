import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { WelcomeCenterTileSize } from '@models/welcome-center';
import {
  SteelheadWelcomeCenterService,
  WelcomeCenter,
  WelcomeCenterColumn,
} from '@services/api-v2/steelhead/welcome-center/steelhead-welcome-center.service';

import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { DomainEnumPrettyPrintOrHumanizePipe } from '@shared/pipes/domain-enum-pretty-print-or-humanize.pipe';
import {
  CalendarEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarMonthViewDay,
  CalendarView,
  collapseAnimation,
} from 'angular-calendar';
import { keys } from 'lodash';
import { EMPTY, Observable, Subject, catchError, switchMap, takeUntil, tap } from 'rxjs';
import {
  WelcomeCenterTileDetailsModalComponent,
  WelcomeCenterTileDetailsModalData,
} from '../../welcome-center-tile-details-modal/steelhead/welcome-center-tile-details-modal.component';
import { CalendarLookupInputs } from '../../../calendar-lookup-inputs/calendar-lookup-inputs.component';

export interface WelcomeCenterMeta {
  column: WelcomeCenterColumn;
  size: WelcomeCenterTileSize;
  weekTooltip: string;
  dayTooltip: string;
  title: string;
  friendlyName: string;
  tileType: string;
  description: string;
  displayConditions: object;
  cssClass: string;
}

export interface TileEventGroup<T> {
  name: string;
  events: CalendarEvent<T>[];
  tileCount: number;
}

export type StewardWelcomeCenterMonthViewDay<T> = CalendarMonthViewDay<T> & {
  eventGroups: TileEventGroup<T>[];
};

/** The Steelhead Welcome Center Calendar View page. */
@Component({
  templateUrl: './steelhead-welcome-center-calendar-view.component.html',
  styleUrls: ['./steelhead-welcome-center-calendar-view.component.scss'],
  providers: [DomainEnumPrettyPrintOrHumanizePipe],
  animations: [collapseAnimation],
})
export class SteelheadWelcomeCenterCalendarViewComponent extends BaseComponent implements OnInit {
  public getMonitor = new ActionMonitor('GET Welcome Center');
  public welcomeCenter: WelcomeCenter;
  public gameTitle: GameTitle;

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();

  public events: CalendarEvent[];

  private alwaysAvailableMinDate: Date = new Date(1, 1, 1);
  private alwaysAvailableMaxDate: Date = new Date(3001, 1, 1);

  private readonly getSchedule$ = new Subject<void>();
  private retrieveSchedule$: Observable<WelcomeCenter>;

  constructor(
    private readonly welcomeCenterService: SteelheadWelcomeCenterService,
    private readonly deppoh: DomainEnumPrettyPrintOrHumanizePipe,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.welcomeCenterService) {
      throw new Error('No service is defined for Welcome Center Calendar.');
    }

    this.getSchedule$
      .pipe(
        tap(() => {
          this.welcomeCenter = undefined;
          this.events = [];
        }),
        this.getMonitor.monitorStart(),
        switchMap(() =>
          this.retrieveSchedule$.pipe(
            this.getMonitor.monitorCatch(),
            catchError(() => {
              this.welcomeCenter = undefined;
              return EMPTY;
            }),
          ),
        ),
        this.getMonitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(welcomeCenter => {
        this.welcomeCenter = welcomeCenter;
        this.events = this.makeEvents(this.welcomeCenter);
      });
  }

  /** Refresh calendar on user interaction. */
  public refreshTable(inputs: CalendarLookupInputs): void {
    if (inputs.identity) {
      if (!inputs.identity?.xuid) {
        this.events = [];
        this.welcomeCenter = null;

        return;
      }

      this.retrieveSchedule$ = this.welcomeCenterService.getWelcomeCenterTilesByUser$(
        inputs?.identity?.xuid,
      );

      this.getSchedule$.next();
    }

    if (inputs.pegasusInfo) {
      if (!inputs.pegasusInfo.environment) {
        this.events = [];
        this.welcomeCenter = null;

        return;
      }

      this.retrieveSchedule$ = this.welcomeCenterService.getWelcomeCenterTilesByPegasus$(
        inputs.pegasusInfo,
      );

      this.getSchedule$.next();
    }
  }

  /** Sets calendar view. */
  public setView(view: CalendarView): void {
    this.view = view;
  }

  /** Opens modal to display day group's tiles with more detail. */
  public groupsClicked(groups: TileEventGroup<WelcomeCenterMeta>[]): void {
    this.dialog.open(WelcomeCenterTileDetailsModalComponent, {
      data: <WelcomeCenterTileDetailsModalData>{ columns: groups },
    });
  }

  /** Counts number of tiles needed to display a column. */
  public countTiles(tiles: CalendarEvent<WelcomeCenterMeta>[]): number {
    let total = 0;
    tiles.forEach(tile => {
      const tileCount = tile.meta.size === WelcomeCenterTileSize.Large ? 2 : 1;
      total = total + tileCount;
    });

    return total;
  }

  /** Angular Calendar hook to group tiles by column. */
  public beforeMonthViewRender(event: CalendarMonthViewBeforeRenderEvent): void {
    const calendarBody = event.body as StewardWelcomeCenterMonthViewDay<WelcomeCenterMeta>[];
    calendarBody.forEach(cell => {
      const groups = {};
      cell.events.forEach((event: CalendarEvent<WelcomeCenterMeta>) => {
        groups[event.meta.column] = groups[event.meta.column] ?? [];
        groups[event.meta.column].push(event);
      });

      keys(groups).forEach(key => {
        const group = groups[key];
        group;
      });

      const eventGroups = Object.entries(groups).map(entry => {
        return {
          name: entry[0],
          events: entry[1],
          tileCount: this.countTiles(entry[1] as CalendarEvent<WelcomeCenterMeta>[]),
        } as TileEventGroup<WelcomeCenterMeta>;
      });

      cell.eventGroups = eventGroups;
    });
  }

  /** Converts Racer's Cup Schedule information into Calendar Events. */
  private makeEvents(welcomeCenter: WelcomeCenter): CalendarEvent[] {
    let events: CalendarEvent<WelcomeCenterMeta>[] = [];

    events = events.concat(this.convertColumnToEventArray(welcomeCenter, WelcomeCenterColumn.Left));
    events = events.concat(
      this.convertColumnToEventArray(welcomeCenter, WelcomeCenterColumn.Center),
    );
    events = events.concat(
      this.convertColumnToEventArray(welcomeCenter, WelcomeCenterColumn.Right),
    );

    return events;
  }

  private convertColumnToEventArray(
    welcomeCenter: WelcomeCenter,
    column: WelcomeCenterColumn,
  ): CalendarEvent<WelcomeCenterMeta>[] {
    const events: CalendarEvent<WelcomeCenterMeta>[] = [];

    for (const tile of welcomeCenter[column]) {
      const startTime = !!tile.startEndDateUtc?.fromUtc
        ? tile.startEndDateUtc.fromUtc.toJSDate()
        : this.alwaysAvailableMinDate;
      const endTime = !!tile.startEndDateUtc?.toUtc
        ? tile.startEndDateUtc.toUtc.toJSDate()
        : this.alwaysAvailableMaxDate;

      const newEvent: CalendarEvent<WelcomeCenterMeta> = {
        start: startTime,
        end: endTime,
        title: `${tile.tileTitle}`,
        cssClass: `event-column-${column}`,
        meta: {
          title: tile.tileTitle,
          friendlyName: tile.tileFriendlyName,
          tileType: tile.tileTypeV3,
          description: tile.tileDescription,
          displayConditions: tile.displayConditionDataList,
          column: column,
          size: tile.size,
          cssClass: `tile ${tile.size.toString().toLowerCase()} ${column}`,
          weekTooltip: `${this.deppoh.transform(column)} Column: ${tile.tileTitle} \r\n (${
            tile.tileFriendlyName
          }) \r\n ${tile.tileDescription}`,
          dayTooltip: `${tile.tileTitle} \r\n ${tile.tileFriendlyName} \r\n ${tile.tileDescription}`,
        },
        allDay: false,
        resizable: {
          beforeStart: false,
          afterEnd: false,
        },
        draggable: false,
      };

      events.push(newEvent);
    }

    return events;
  }
}
