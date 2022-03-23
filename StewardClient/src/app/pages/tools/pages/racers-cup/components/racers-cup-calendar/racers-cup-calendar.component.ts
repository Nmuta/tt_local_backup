import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { CalendarEvent } from 'calendar-utils';
import { catchError, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';
import {
  CalendarView,
  CalendarMonthViewDay,
  collapseAnimation,
  CalendarMonthViewBeforeRenderEvent,
} from 'angular-calendar';
import { SteelheadService } from '@services/steelhead';
import BigNumber from 'bignumber.js';
import {
  RacersCupSchedule,
  RacersCupEventWindow,
  RacersCupGameOptions,
  RacersCupQualificationOptions,
} from '@models/racers-cup.model';
import { indexOf, sortBy, uniq } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import {
  RacersCupSeriesModalComponent,
  RacersCupSeriesModalData,
} from '../racers-cup-series-modal/racers-cup-series-modal.component';
import { RacersCupCalendarInputs } from '../racers-cup-inputs/racers-cup-inputs.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

export type EventGroup<T> = [string, CalendarEvent<T>[]];

export type StewardCalendarMonthViewDay<T> = CalendarMonthViewDay<T> & {
  eventGroups: EventGroup<T>[];
};

export interface RacersCupMeta {
  seriesName: string;
  eventNameRaw: string;
  eventNameClean: string;
  id: string;
  courseName: string;
  circuitName: string;
  eventWindow: RacersCupEventWindow;
  gameOptions: RacersCupGameOptions[];
  qualificationOptions: RacersCupQualificationOptions;
  eventOpenPracticeInMinutes: BigNumber;
  raceDuration: BigNumber;
  weekTooltip: string;
}

export interface EventNameInfo {
  id: string;
  courseName: string;
  circuitName: string;
}

/** Racer's Cup Calendar component. */
@Component({
  templateUrl: './racers-cup-calendar.component.html',
  styleUrls: ['./racers-cup-calendar.component.scss'],
  animations: [collapseAnimation],
})
export class RacersCupCalendarComponent extends BaseComponent implements OnInit {
  private readonly groupIndexLabel = 'eventGroups';
  private readonly getSchedule$ = new Subject<void>();
  private xuid: BigNumber;
  private daysForward: number;
  private schedule: RacersCupSchedule;
  private uniqueSeries: string[];

  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public events: CalendarEvent[] = [];
  public getMonitor = new ActionMonitor('GET Racers Cup Schedule');

  constructor(
    private readonly steelheadService: SteelheadService,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.steelheadService) {
      throw new Error('No service provided for Racers Cup Schedule.');
    }

    this.getSchedule$
      .pipe(
        tap(() => {
          this.getMonitor = this.getMonitor.repeat();
          this.schedule = undefined;
          this.events = [];
        }),
        switchMap(() =>
          this.steelheadService
            .getRacersCupScheduleForUser$(this.xuid, null, this.daysForward)
            .pipe(
              this.getMonitor.monitorSingleFire(),
              catchError(() => {
                this.schedule = undefined;
                return EMPTY;
              }),
            ),
        ),
        takeUntil(this.onDestroy$),
      )
      .subscribe(returnSchedule => {
        this.schedule = returnSchedule;
        this.events = this.makeEvents(this.schedule);
      });
  }

  /** Refresh calendar on user interaction. */
  public refreshTable(inputs: RacersCupCalendarInputs): void {
    if (!inputs.identity?.xuid) {
      this.events = [];
      this.uniqueSeries = null;
      this.schedule = null;

      return;
    }

    this.xuid = inputs?.identity?.xuid;
    this.daysForward = inputs?.daysForward;

    this.getSchedule$.next();
  }

  /** Sets calendar view. */
  public setView(view: CalendarView): void {
    this.view = view;
  }

  /** Handle clicking on event group. */
  public groupClicked(group: EventGroup<RacersCupMeta>): void {
    const seriesName = group[0];
    const events = group[1];

    this.dialog.open(RacersCupSeriesModalComponent, {
      data: <RacersCupSeriesModalData>{ name: seriesName, events: events },
    });
  }

  /** Get group index by series name. */
  public getGroupIndex(name: string): number {
    return indexOf(this.uniqueSeries, name);
  }

  /** Angular Calendar hook to group events by name. */
  public beforeMonthViewRender(event: CalendarMonthViewBeforeRenderEvent): void {
    // month view has a different UX from the week and day view so we only really need to group by the series name.
    const calendarBody = event.body as StewardCalendarMonthViewDay<RacersCupMeta>[];
    calendarBody.forEach(cell => {
      const groups = {};
      cell.events.forEach((event: CalendarEvent<RacersCupMeta>) => {
        groups[event.meta.seriesName] = groups[event.meta.seriesName] ?? [];
        groups[event.meta.seriesName].push(event);
      });

      //Ensure that the series group ordering doesn't change based on order of events that occur that day.
      cell.eventGroups = this.sortDayGroups(Object.entries(groups) as EventGroup<RacersCupMeta>[]);
    });
  }

  /** Converts Racer's Cup Schedule information into Calendar Events. */
  private makeEvents(schedule: RacersCupSchedule): CalendarEvent[] {
    const events: CalendarEvent<RacersCupMeta>[] = [];
    for (const championship of schedule.championships) {
      // Build an ordered set of series for use sorting later.
      this.uniqueSeries = uniq(championship.series.map(series => series.name));

      for (const series of championship.series) {
        for (const event of series.events) {
          for (const eventWindow of event.eventWindows) {
            const eventInfo = this.seperateEventInfo(event.name);
            const newEvent: CalendarEvent<RacersCupMeta> = {
              start: eventWindow.startTimeUtc.toJSDate(),
              end: eventWindow.endTimeUtc.toJSDate(),
              title: `${eventInfo.courseName}-${
                eventInfo.circuitName
              }: ${eventWindow.startTimeUtc.toJSDate()} - ${eventWindow.endTimeUtc.toJSDate()}`,
              cssClass: `event-type-${this.getGroupIndex(series.name)}`,
              meta: {
                seriesName: series.name,
                eventNameRaw: event.name,
                eventNameClean: `${eventInfo.courseName}-${eventInfo.circuitName}`,
                courseName: eventInfo.courseName,
                circuitName: eventInfo.circuitName,
                id: eventInfo.id,
                eventWindow: eventWindow,
                gameOptions: event.gameOptions,
                qualificationOptions: event.qualificationOptions,
                eventOpenPracticeInMinutes: event.openPracticeInMinutes,
                raceDuration: new BigNumber(
                  eventWindow.endTimeUtc.diff(eventWindow.startTimeUtc, ['minutes']).minutes,
                ),
                weekTooltip: `${series.name}-${eventInfo.courseName}-${eventInfo.circuitName}`,
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
        }
      }
    }

    return this.sortEvents(events);
  }

  /** Sorts Racer's Cup events by date. */
  private sortEvents(events: CalendarEvent<RacersCupMeta>[]): CalendarEvent<RacersCupMeta>[] {
    return sortBy(events, o => {
      return o.start;
    });
  }

  /** Sorts Racer's Cup event groups by unique series index. */
  private sortDayGroups(groups: EventGroup<RacersCupMeta>[]): EventGroup<RacersCupMeta>[] {
    return sortBy(groups, o => {
      return this.getGroupIndex(o[0]);
    });
  }

  /** Extracts course name, circuit name, and id from CMS file name. */
  private seperateEventInfo(rawName: string): EventNameInfo {
    //Trims ID off of content '1009-YasMarina-NorthCircuit' -> YasMarina-NorthCircuit
    const courseAndCircuit = rawName.replace(/(?:^\d*\s\-\s)/g, '');
    return {
      id: rawName.match(new RegExp(/(?:^\d*)/g))[0],
      courseName: courseAndCircuit.split('-')[0],
      circuitName: courseAndCircuit.split('-')[1],
    };
  }
}
