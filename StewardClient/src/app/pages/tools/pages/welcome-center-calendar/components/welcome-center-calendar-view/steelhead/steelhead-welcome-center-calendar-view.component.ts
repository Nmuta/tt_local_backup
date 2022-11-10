import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import {
  SteelheadWelcomeCenterService,
  WelcomeCenter,
  WelcomeCenterColumn,
  WelcomeCenterTileSize,
} from '@services/api-v2/steelhead/welcome-center/steelhead-user-group.service';
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
import { takeUntil } from 'rxjs';

export interface WelcomeCenterMeta {
  column: WelcomeCenterColumn;
  size: WelcomeCenterTileSize;
  weekTooltip: string;
  dayTooltip: string;
}

export interface TileEventGroup<T> {
  name: string;
  events: CalendarEvent<T>;
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
  public getActionMonitor = new ActionMonitor('GET car details');
  public welcomeCenter: WelcomeCenter;
  public gameTitle: GameTitle;

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();

  public events: CalendarEvent[];

  constructor(
    private readonly welcomeCenterService: SteelheadWelcomeCenterService,
    private readonly deppoh: DomainEnumPrettyPrintOrHumanizePipe,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.welcomeCenterService) {
      throw new Error('No service is defined for Welcome Center Calendar.');
    }

    this.welcomeCenterService
      .getWelcomeCenterTiles$()
      .pipe(this.getActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(welcomeCenter => {
        this.welcomeCenter = welcomeCenter;
        this.events = this.makeEvents(this.welcomeCenter);
      });
  }

  /** Sets calendar view. */
  public setView(view: CalendarView): void {
    this.view = view;
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
      const newEvent: CalendarEvent<WelcomeCenterMeta> = {
        start: new Date('01/01/2001'), // TODO: Waiting on update from Madden on source of truth for tile display times.
        end: new Date('01/01/2101'), // TODO: Waiting on update from Madden on source of truth for tile display times.
        title: `${tile.tileTitle}`,
        cssClass: `event-column-${column}`,
        meta: {
          column: column,
          size: tile.size,
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
