import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { DomainEnumPrettyPrintOrHumanizePipe } from '@shared/pipes/domain-enum-pretty-print-or-humanize.pipe';
import { CalendarEvent, CalendarView, collapseAnimation } from 'angular-calendar';
import { takeUntil } from 'rxjs';
import { RivalsEvent, SteelheadRivalsService } from '@services/api-v2/steelhead/rivals/steelhead-rivals.service';
import { RivalsTileDetailsModalComponent } from '../rivals-tile-details-modal/rivals-tile-details-modal.component';

/** The Steelhead Rivals Calendar View page. */
@Component({
  templateUrl: './steelhead-rivals-calendar-view.component.html',
  styleUrls: ['./steelhead-rivals-calendar-view.component.scss'],
  providers: [DomainEnumPrettyPrintOrHumanizePipe],
  animations: [collapseAnimation],
})
export class SteelheadRivalsCalendarViewComponent extends BaseComponent implements OnInit {
  public getActionMonitor = new ActionMonitor('GET rivals event details');

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();

  public events: CalendarEvent[];

  constructor(
    private readonly steelheadRivalsService: SteelheadRivalsService,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.steelheadRivalsService) {
      throw new Error('No service is defined for Rivals Calendar.');
    }

    this.getActionMonitor = this.getActionMonitor.repeat();


    this.steelheadRivalsService.getRivalsEvents$()
      .pipe(this.getActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(rivalsEvents => {
        this.events = this.makeRivalsEventsCalendarEvent(rivalsEvents);
      });
  }

  /** Sets calendar view. */
  public setView(view: CalendarView): void {
    this.view = view;
  }

  /** Opens modal to display day group's tiles with more detail. */
  public eventClicked(event: CalendarEvent<RivalsEvent>): void {
    this.dialog.open(RivalsTileDetailsModalComponent, {
      data: event.meta,
    });
  }

  /** Converts rivals events into Calendar Events. */
  private makeRivalsEventsCalendarEvent(rivalsEvents: RivalsEvent[]): CalendarEvent[] {
    const events: CalendarEvent<RivalsEvent>[] = [];

    for (const rivalsEvent of rivalsEvents) {
      const newEvent: CalendarEvent<RivalsEvent> = {
        start: new Date(rivalsEvent.startTime),
        end: new Date(rivalsEvent.endTime),
        title: `${rivalsEvent.name}`,
        cssClass: `unique-left-border-color-1-of-5`,
        meta: rivalsEvent,
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
