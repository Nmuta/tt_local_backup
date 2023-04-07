import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { SimpleCar } from '@models/cars';
import {
  BuildersCupCarRestriction,
  BuildersCupFeaturedTour,
  SteelheadBuildersCupService,
} from '@services/api-v2/steelhead/builders-cup/steelhead-builders-cup.service';

import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import {
  CalendarEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarMonthViewDay,
  CalendarView,
  collapseAnimation,
} from 'angular-calendar';
import { includes, indexOf, max, sortBy, uniq } from 'lodash';
import { DateTime } from 'luxon';
import { takeUntil } from 'rxjs';
import {
  SteelheadBuildersCupLadderModalComponent,
  SteelheadBuildersCupLadderModalData,
} from '../../builders-cup-ladder-modal/steelhead/steelhead-builders-cup-ladder-modal.component';

type TourGroup<T> = {
  tourName: string;
  tourCssClass: string;
  tourSeries: CalendarEvent<T>[];
};

type StewardCalendarMonthViewDay<T> = CalendarMonthViewDay<T> & {
  eventGroups: TourGroup<T>[];
};

/** Represents Builder's Cup specific data for use in a calendar event */
export interface BuildersCupMeta {
  tourName: string;
  seriesName: string;
  tourColorIndex: number;
  tourDescription: string;
  seriesDescription: string;
  openTimeUtc: DateTime;
  closeTimeUtc: DateTime;
  isDisabled: boolean;
  seriesAllowedCarClass: BuildersCupCarRestriction;
  seriesAllowedCars: SimpleCar[];
}

/** The Steelhead Builder's Cup Calendar View page. */
@Component({
  templateUrl: './steelhead-builders-cup-calendar-view.component.html',
  styleUrls: ['./steelhead-builders-cup-calendar-view.component.scss'],
  animations: [collapseAnimation],
})
export class SteelheadBuildersCupCalendarViewComponent extends BaseComponent implements OnInit {
  public getActionMonitor = new ActionMonitor('GET car details');
  public buildersCupSchedule: BuildersCupFeaturedTour[];

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();

  public events: CalendarEvent[];
  public filteredEvents: CalendarEvent<BuildersCupMeta>[] = [];

  public uniqueTours: string[];
  public seriesDictionary = new Map<string, string[]>();

  public get tourCount() {
    return max([this.uniqueTours?.length, 5]);
  }

  constructor(
    private readonly buildersCupService: SteelheadBuildersCupService,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.buildersCupService) {
      throw new Error("No service is defined for Builder's Cup Calendar.");
    }

    this.getActionMonitor = this.getActionMonitor.repeat();
    this.buildersCupService
      .getBuildersCupSchedule$()
      .pipe(this.getActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(buildersCupSchedule => {
        this.uniqueTours = null;
        this.buildersCupSchedule = buildersCupSchedule;
        this.events = this.makeEvents(this.buildersCupSchedule);
        this.filterEvents(this.seriesDictionary);
      });
  }

  /** Sets calendar view. */
  public setView(view: CalendarView): void {
    this.view = view;
  }

  /** Handle clicking on event group. */
  public groupClicked(group: TourGroup<BuildersCupMeta>): void {
    const tourName = group.tourName;
    const events = group.tourSeries;
    this.dialog.open(SteelheadBuildersCupLadderModalComponent, {
      data: <SteelheadBuildersCupLadderModalData>{ name: tourName, events: events },
    });
  }

  /** Get group index by tour name. */
  public getGroupIndex(name: string): number {
    return indexOf(this.uniqueTours, name) + 1; //+1 required here to align with scss indexing :(
  }

  /** Angular Calendar hook to group events by name. */
  public beforeMonthViewRender(event: CalendarMonthViewBeforeRenderEvent): void {
    // month view has a different UX from the week and day view so we only really need to group by the series name.
    const calendarBody = event.body as StewardCalendarMonthViewDay<BuildersCupMeta>[];
    calendarBody.forEach(cell => {
      const groups = {};
      cell.events.forEach((event: CalendarEvent<BuildersCupMeta>) => {
        groups[event.meta.tourName] = groups[event.meta.tourName] ?? [];
        groups[event.meta.tourName].push(event);
      });

      const eventGroups = Object.entries(groups).map(entry => {
        const indexInGroup = this.getGroupIndex(entry[0]);
        const maxGroupSize = max([this.uniqueTours.length, 5]);

        return {
          tourName: entry[0],
          tourSeries: entry[1],
          tourCssClass: `badge unique-left-border-color-${indexInGroup}-of-${maxGroupSize}`,
        } as TourGroup<BuildersCupMeta>;
      });

      //Ensure that the series group ordering doesn't change based on order of events that occur that day.
      cell.eventGroups = this.sortDayGroups(eventGroups);
    });
  }

  /** Filter events. */
  public filterEvents(tourSeriesMap: Map<string, string[]>): void {
    const supportedTours = [...tourSeriesMap.keys()];
    const sortedEvents = this.events.filter(event => {
      const isTourSupported = includes(supportedTours, event.meta.tourName);
      const isSeriesInTour = includes(
        tourSeriesMap.get(event.meta.tourName),
        event.meta.seriesName,
      );
      const isSeriesSupported = isTourSupported && isSeriesInTour;

      return isSeriesSupported;
    });

    this.filteredEvents = sortedEvents;
  }

  /** Converts Builders's Cup Schedule information into Calendar Events. */
  private makeEvents(featuredTours: BuildersCupFeaturedTour[]): CalendarEvent[] {
    const events: CalendarEvent<BuildersCupMeta>[] = [];
    const ladderSeriesMapping = new Map<string, string[]>();

    // Build an ordered set of tours for use sorting later.
    this.uniqueTours = uniq(featuredTours.map(series => series.name));

    featuredTours.forEach(tour => {
      tour.championshipSeries.forEach(series => {
        if (series.openTimeUtc.equals(series.closeTimeUtc)) {
          // Skip this series, it's not scheduled despite being part of the ladder
          return;
        }

        if (ladderSeriesMapping.has(tour.name)) {
          ladderSeriesMapping.get(tour.name).push(series.name);
        } else {
          ladderSeriesMapping.set(tour.name, [series.name]);
        }

        const newEvent: CalendarEvent<BuildersCupMeta> = {
          start: max([series.openTimeUtc.toJSDate(), tour.openTimeUtc.toJSDate()]),
          end: tour.closeTimeUtc.toJSDate(),
          title: `${tour.name} - ${series.name}`,
          meta: {
            tourName: tour.name,
            seriesName: series.name,
            tourColorIndex: this.getGroupIndex(tour.name),
            tourDescription: tour.description,
            seriesDescription: series.description,
            openTimeUtc: tour.openTimeUtc,
            closeTimeUtc: tour.closeTimeUtc,
            isDisabled: tour.isDisabled,
            seriesAllowedCars: series.allowedCars,
            seriesAllowedCarClass: series.allowedCarClass,
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
    });

    // Clean out duplicates
    for (const keyValuePair of ladderSeriesMapping) {
      ladderSeriesMapping.set(keyValuePair[0], uniq(keyValuePair[1]));
    }
    this.seriesDictionary = ladderSeriesMapping;

    return events;
  }

  /** Sorts Builder's Cup series groups by unique tour/ladder index. */
  private sortDayGroups(groups: TourGroup<BuildersCupMeta>[]): TourGroup<BuildersCupMeta>[] {
    return sortBy(groups, o => {
      return this.getGroupIndex(o.tourName);
    });
  }
}
