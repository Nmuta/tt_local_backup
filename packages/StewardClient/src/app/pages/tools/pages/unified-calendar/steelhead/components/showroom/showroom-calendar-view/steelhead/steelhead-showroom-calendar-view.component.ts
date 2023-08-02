import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { DomainEnumPrettyPrintOrHumanizePipe } from '@shared/pipes/domain-enum-pretty-print-or-humanize.pipe';
import { CalendarEvent, CalendarView, collapseAnimation } from 'angular-calendar';
import { combineLatest, takeUntil } from 'rxjs';
import {
  CarFeaturedShowcase,
  CarSale,
  DivisionFeaturedShowcase,
  ManufacturerFeaturedShowcase,
  SteelheadShowroomService,
} from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';
import { ShowroomSaleTileDetailsModalComponent } from '../../showroom-sale-tile-details-modal/steelhead/showroom-sale-tile-details-modal.component';
import { ShowroomCarFeaturedTileDetailsModalComponent } from '../../showroom-car-featured-tile-details-modal/steelhead/showroom-car-featured-tile-details-modal.component';
import { ShowroomDivisionFeaturedTileDetailsModalComponent } from '../../showroom-division-featured-tile-details-modal/steelhead/showroom-division-featured-tile-details-modal.component';
import { ShowroomManufacturerFeaturedTileDetailsModalComponent } from '../../showroom-manufacturer-featured-tile-details-modal/steelhead/showroom-manufacturer-featured-tile-details-modal.component';
import { MIN_CALENDAR_DATETIME, MAX_CALENDAR_DATETIME } from '@shared/constants';

export enum ShowroomEventType {
  CarSale = 'Car Sale',
  CarFeaturedShowcase = 'Car Featured Showcase',
  DivisionFeaturedShowcase = 'Division Featured Showcase',
  ManufacturerFeaturedShowcase = 'Manufacturer Featured Showcase',
}

export interface ShowroomMeta {
  carFeaturedShowcase: CarFeaturedShowcase;
  divisionFeaturedShowcase: DivisionFeaturedShowcase;
  manufacturerFeaturedShowcase: ManufacturerFeaturedShowcase;
  carSale: CarSale;
  eventType: ShowroomEventType;
}

/** The Steelhead Showroom Calendar View page. */
@Component({
  templateUrl: './steelhead-showroom-calendar-view.component.html',
  styleUrls: ['./steelhead-showroom-calendar-view.component.scss'],
  providers: [DomainEnumPrettyPrintOrHumanizePipe],
  animations: [collapseAnimation],
})
export class SteelheadShowroomCalendarViewComponent extends BaseComponent implements OnInit {
  public getActionMonitor = new ActionMonitor('GET showroom calendar details');

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();

  public events: CalendarEvent[];
  public filteredEvents: CalendarEvent<ShowroomMeta>[] = [];

  constructor(
    private readonly steelheadShowroomService: SteelheadShowroomService,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.steelheadShowroomService) {
      throw new Error('No service is defined for Showroom Calendar.');
    }

    this.getActionMonitor = this.getActionMonitor.repeat();

    combineLatest([
      this.steelheadShowroomService.getCarFeaturedShowcases$(),
      this.steelheadShowroomService.getDivisionFeaturedShowcases$(),
      this.steelheadShowroomService.getManufacturerFeaturedShowcases$(),
      this.steelheadShowroomService.getCarSales$(),
    ])
      .pipe(this.getActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(
        ([
          carFeaturedShowcase,
          divisionFeaturedShowcase,
          manufacturerFeaturedShowcase,
          carSales,
        ]) => {
          this.events = this.makeCarFeaturedEvents(carFeaturedShowcase);
          this.events = this.events.concat(
            this.makeDivisionFeaturedEvents(divisionFeaturedShowcase),
          );
          this.events = this.events.concat(
            this.makeManufacturerFeaturedEvents(manufacturerFeaturedShowcase),
          );
          this.events = this.events.concat(this.makeSaleEvents(carSales));
          this.filteredEvents = this.events;
        },
      );
  }

  /** Sets calendar view. */
  public setView(view: CalendarView): void {
    this.view = view;
  }

  /** Opens modal to display day group's tiles with more detail. */
  public eventClicked(event: CalendarEvent<ShowroomMeta>): void {
    // Somehow figure out which type of featured showcase it is. Car/Division/Manufacturer call a different component for each. Fuck it
    if (event.meta.carFeaturedShowcase) {
      this.dialog.open(ShowroomCarFeaturedTileDetailsModalComponent, {
        data: event.meta.carFeaturedShowcase,
      });
    } else if (event.meta.divisionFeaturedShowcase) {
      this.dialog.open(ShowroomDivisionFeaturedTileDetailsModalComponent, {
        data: event.meta.divisionFeaturedShowcase,
      });
    } else if (event.meta.manufacturerFeaturedShowcase) {
      this.dialog.open(ShowroomManufacturerFeaturedTileDetailsModalComponent, {
        data: event.meta.manufacturerFeaturedShowcase,
      });
    } else if (event.meta.carSale) {
      this.dialog.open(ShowroomSaleTileDetailsModalComponent, {
        data: event.meta.carSale,
      });
    }
  }

  /** Filter events. */
  public filterEvents(selectedEventTypes: ShowroomEventType[]): void {
    this.filteredEvents = this.events.filter(x => selectedEventTypes.includes(x.meta.eventType));
  }

  /** Converts car featured showcase into Calendar Events. */
  private makeCarFeaturedEvents(carFeaturedShowcases: CarFeaturedShowcase[]): CalendarEvent[] {
    const events: CalendarEvent<ShowroomMeta>[] = [];

    for (const carFeaturedShowcase of carFeaturedShowcases) {
      const startTime = carFeaturedShowcase?.startTimeUtc ?? MIN_CALENDAR_DATETIME;
      const endTime = carFeaturedShowcase?.endTimeUtc ?? MAX_CALENDAR_DATETIME;

      const newEvent = this.makeCalendarEvent(
        startTime.toJSDate(),
        endTime.toJSDate(),
        carFeaturedShowcase.title,
        {
          carFeaturedShowcase: carFeaturedShowcase,
          divisionFeaturedShowcase: undefined,
          manufacturerFeaturedShowcase: undefined,
          carSale: undefined,
          eventType: ShowroomEventType.CarFeaturedShowcase,
        },
        `unique-left-border-color-1-of-5`,
      );

      events.push(newEvent);
    }

    return events;
  }

  /** Converts division featured showcase into Calendar Events. */
  private makeDivisionFeaturedEvents(
    divisionFeaturedShowcases: DivisionFeaturedShowcase[],
  ): CalendarEvent[] {
    const events: CalendarEvent<ShowroomMeta>[] = [];

    for (const divisionFeaturedShowcase of divisionFeaturedShowcases) {
      const startTime = divisionFeaturedShowcase?.startTimeUtc ?? MIN_CALENDAR_DATETIME;
      const endTime = divisionFeaturedShowcase?.endTimeUtc ?? MAX_CALENDAR_DATETIME;

      const newEvent = this.makeCalendarEvent(
        startTime.toJSDate(),
        endTime.toJSDate(),
        divisionFeaturedShowcase.title,
        {
          carFeaturedShowcase: undefined,
          divisionFeaturedShowcase: divisionFeaturedShowcase,
          manufacturerFeaturedShowcase: undefined,
          carSale: undefined,
          eventType: ShowroomEventType.DivisionFeaturedShowcase,
        },
        `unique-left-border-color-3-of-5`,
      );

      events.push(newEvent);
    }

    return events;
  }

  /** Converts manufacturer featured showcase into Calendar Events. */
  private makeManufacturerFeaturedEvents(
    manufacturerFeaturedShowcases: ManufacturerFeaturedShowcase[],
  ): CalendarEvent[] {
    const events: CalendarEvent<ShowroomMeta>[] = [];

    for (const manufacturerFeaturedShowcase of manufacturerFeaturedShowcases) {
      const startTime = manufacturerFeaturedShowcase?.startTimeUtc ?? MIN_CALENDAR_DATETIME;
      const endTime = manufacturerFeaturedShowcase?.endTimeUtc ?? MAX_CALENDAR_DATETIME;

      const newEvent = this.makeCalendarEvent(
        startTime.toJSDate(),
        endTime.toJSDate(),
        manufacturerFeaturedShowcase.title,
        {
          carFeaturedShowcase: undefined,
          divisionFeaturedShowcase: undefined,
          manufacturerFeaturedShowcase: manufacturerFeaturedShowcase,
          carSale: undefined,
          eventType: ShowroomEventType.ManufacturerFeaturedShowcase,
        },
        `unique-left-border-color-4-of-5`,
      );

      events.push(newEvent);
    }

    return events;
  }

  /** Converts car sales into Calendar Events. */
  private makeSaleEvents(carSales: CarSale[]): CalendarEvent[] {
    const events: CalendarEvent<ShowroomMeta>[] = [];

    for (const carSale of carSales) {
      const startTime = carSale?.startTimeUtc ?? MIN_CALENDAR_DATETIME;
      const endTime = carSale?.endTimeUtc ?? MAX_CALENDAR_DATETIME;

      const newEvent = this.makeCalendarEvent(
        startTime.toJSDate(),
        endTime.toJSDate(),
        carSale.name,
        {
          carFeaturedShowcase: undefined,
          divisionFeaturedShowcase: undefined,
          manufacturerFeaturedShowcase: undefined,
          carSale: carSale,
          eventType: ShowroomEventType.CarSale,
        },
        `unique-left-border-color-2-of-5`,
      );

      events.push(newEvent);
    }

    return events;
  }

  private makeCalendarEvent(
    startTime: Date,
    endTime: Date,
    title: string,
    meta: ShowroomMeta,
    cssClass: string,
  ) {
    const newEvent: CalendarEvent<ShowroomMeta> = {
      start: startTime,
      end: endTime,
      title: title,
      cssClass: cssClass,
      meta: meta,
      allDay: true,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
      draggable: false,
    };

    return newEvent;
  }
}
