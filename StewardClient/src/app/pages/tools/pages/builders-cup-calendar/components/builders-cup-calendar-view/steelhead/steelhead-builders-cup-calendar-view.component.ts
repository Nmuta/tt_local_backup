import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import {
  BuildersCupFeaturedTour,
  SteelheadBuildersCupService,
} from '@services/api-v2/steelhead/builders-cup/steelhead-builders-cup.service';

import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { DomainEnumPrettyPrintOrHumanizePipe } from '@shared/pipes/domain-enum-pretty-print-or-humanize.pipe';
import {
  CalendarEvent,
  CalendarMonthViewDay,
  CalendarView,
  collapseAnimation,
} from 'angular-calendar';
import { indexOf, max } from 'lodash';
import { DateTime } from 'luxon';
import { takeUntil } from 'rxjs';

export interface BuildersCupMeta {
  name: string;
  description: string;
  openTimeUtc: DateTime;
  closeTimeUtc: DateTime;
  isDisabled: boolean;
}

export interface TileEventGroup<T> {
  name: string;
  events: CalendarEvent<T>[];
  tileCount: number;
}

export type StewardBuildersCupMonthViewDay<T> = CalendarMonthViewDay<T> & {
  eventGroups: TileEventGroup<T>[];
};

/** The Steelhead Builder's Cup Calendar View page. */
@Component({
  templateUrl: './steelhead-builders-cup-calendar-view.component.html',
  styleUrls: ['./steelhead-builders-cup-calendar-view.component.scss'],
  providers: [DomainEnumPrettyPrintOrHumanizePipe],
  animations: [collapseAnimation],
})
export class SteelheadBuildersCupCalendarViewComponent extends BaseComponent implements OnInit {
  public getActionMonitor = new ActionMonitor('GET car details');
  public buildersCupSchedule: BuildersCupFeaturedTour[];
  public gameTitle: GameTitle;

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();

  public events: CalendarEvent[];

  constructor(
    private readonly buildersCupService: SteelheadBuildersCupService,
    private readonly deppoh: DomainEnumPrettyPrintOrHumanizePipe,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.buildersCupService) {
      throw new Error("No service is defined for Builder's Cup Calendar.");
    }

    this.buildersCupService
      .getBuildersCupSchedule$()
      .pipe(this.getActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(buildersCupSchedule => {
        this.buildersCupSchedule = buildersCupSchedule;
        this.events = this.makeEvents(this.buildersCupSchedule);
      });
  }

  /** Sets calendar view. */
  public setView(view: CalendarView): void {
    this.view = view;
  }

  /** Converts Builders's Cup Schedule information into Calendar Events. */
  private makeEvents(featuredTours: BuildersCupFeaturedTour[]): CalendarEvent[] {
    const events: CalendarEvent<BuildersCupMeta>[] = [];

    featuredTours.forEach(tour => {
      const newEvent: CalendarEvent<BuildersCupMeta> = {
        start: tour.openTimeUtc.toJSDate(),
        end: tour.closeTimeUtc.toJSDate(),
        title: `${tour.name}`,
        cssClass: `unique-left-border-color-${indexOf(featuredTours, tour) + 1}-of-${max([
          featuredTours.length,
          5, // Use 5 unique colors minimum
        ])}`,
        meta: {
          name: tour.name,
          description: tour.description,
          openTimeUtc: tour.openTimeUtc,
          closeTimeUtc: tour.closeTimeUtc,
          isDisabled: tour.isDisabled,
        },
        allDay: false,
        resizable: {
          beforeStart: false,
          afterEnd: false,
        },
        draggable: false,
      };

      events.push(newEvent);
    });

    return events;
  }
}
