import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { DomainEnumPrettyPrintOrHumanizePipe } from '@shared/pipes/domain-enum-pretty-print-or-humanize.pipe';
import { CalendarEvent, CalendarView, collapseAnimation } from 'angular-calendar';
import { combineLatest, takeUntil } from 'rxjs';
import { ShowroomFeaturedTileDetailsModalComponent } from '../../showroom-featured-tile-details-modal/steelhead/showroom-featured-tile-details-modal.component';
import {
  CarFeaturedShowcase,
  CarSale,
  SteelheadShowroomService,
} from '@services/api-v2/steelhead/showroom/steelhead-showroom.service';
import { ShowroomSaleTileDetailsModalComponent } from '../../showroom-sale-tile-details-modal/steelhead/showroom-sale-tile-details-modal.component';

export interface ShowroomMeta {
  carFeaturedShowcase: CarFeaturedShowcase;
  carSale: CarSale;
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
      this.steelheadShowroomService.getCarSales$(),
    ])
      .pipe(this.getActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(([carFeaturedShowcase, carSales]) => {
        this.events = this.makeFeaturedEvents(carFeaturedShowcase);
        this.events = this.events.concat(this.makeSaleEvents(carSales));
      });
  }

  /** Sets calendar view. */
  public setView(view: CalendarView): void {
    this.view = view;
  }

  /** Opens modal to display day group's tiles with more detail. */
  public eventClicked(event: CalendarEvent<ShowroomMeta>): void {
    if (event.meta.carFeaturedShowcase) {
      this.dialog.open(ShowroomFeaturedTileDetailsModalComponent, {
        data: event.meta.carFeaturedShowcase,
      });
    } else if (event.meta.carSale) {
      this.dialog.open(ShowroomSaleTileDetailsModalComponent, {
        data: event.meta.carSale,
      });
    }
  }

  /** Converts car featured showcase into Calendar Events. */
  private makeFeaturedEvents(carFeaturedShowcases: CarFeaturedShowcase[]): CalendarEvent[] {
    const events: CalendarEvent<ShowroomMeta>[] = [];

    for (const carFeaturedShowcase of carFeaturedShowcases) {
      const newEvent: CalendarEvent<ShowroomMeta> = {
        start: new Date(carFeaturedShowcase.startTime),
        end: new Date(carFeaturedShowcase.endTime),
        title: `${carFeaturedShowcase.title}`,
        cssClass: `unique-left-border-color-1-of-5`,
        meta: {
          carFeaturedShowcase: carFeaturedShowcase,
          carSale: undefined,
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

  /** Converts car sales into Calendar Events. */
  private makeSaleEvents(carSales: CarSale[]): CalendarEvent[] {
    const events: CalendarEvent<ShowroomMeta>[] = [];

    for (const carSale of carSales) {
      const newEvent: CalendarEvent<ShowroomMeta> = {
        start: new Date(carSale.startTime),
        end: new Date(carSale.endTime),
        title: `${carSale.name}`,
        cssClass: `unique-left-border-color-2-of-5`,
        meta: {
          carFeaturedShowcase: undefined,
          carSale: carSale,
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
