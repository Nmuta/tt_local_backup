import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { CalendarEvent } from 'calendar-utils';
import { catchError, EMPTY, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
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
import {
  buildOutlookDateString,
  buildOutlookTimeString,
  getOutlookCalendarHeaders,
} from '@helpers/outlook-calendar-exporter';
import { keys } from 'lodash';

export type EventGroup<T> = {
  name: string;
  seriesColorIndex: number;
  events: CalendarEvent<T>[];
};

export type StewardCalendarMonthViewDay<T> = CalendarMonthViewDay<T> & {
  eventGroups: EventGroup<T>[];
};

export interface RacersCupMeta {
  seriesName: string;
  seriesColorIndex: number;
  playlistName: string;
  eventNameRaw: string;
  eventNameClean: string;
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
  private readonly getSchedule$ = new Subject<void>();
  private retrieveSchedule$: Observable<RacersCupSchedule>;
  private schedule: RacersCupSchedule;

  public playlistDictionary = new Map<string, string[]>();

  public calendarCsvData: string[][];
  public uniqueSeries: string[];
  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public events: CalendarEvent[] = [];
  public filteredEvents: CalendarEvent[] = [];
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
          this.schedule = undefined;
          this.uniqueSeries = null;
          this.events = [];
        }),
        this.getMonitor.monitorStart(),
        switchMap(() =>
          this.retrieveSchedule$.pipe(
            this.getMonitor.monitorCatch(),
            catchError(() => {
              this.schedule = undefined;
              return EMPTY;
            }),
          ),
        ),
        this.getMonitor.monitorEnd(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(returnSchedule => {
        this.schedule = returnSchedule;
        this.events = this.makeEvents(this.schedule);
        this.filterEvents(this.playlistDictionary);
      });
  }

  /** Refresh calendar on user interaction. */
  public refreshTable(inputs: RacersCupCalendarInputs): void {
    if (inputs.identity) {
      if (!inputs.identity?.xuid) {
        this.events = [];
        this.uniqueSeries = null;
        this.playlistDictionary = null;
        this.schedule = null;

        return;
      }

      this.retrieveSchedule$ = this.steelheadService.getRacersCupScheduleForUser$(
        inputs?.identity?.xuid,
        null,
        inputs?.daysForward,
      );

      this.getSchedule$.next();
    }

    if (inputs.pegasusInfo) {
      if (!inputs.pegasusInfo.environment) {
        this.events = [];
        this.uniqueSeries = null;
        this.playlistDictionary = null;
        this.schedule = null;
      }

      this.retrieveSchedule$ = this.steelheadService.getRacersCupScheduleByPegasusPath$(
        inputs.pegasusInfo,
        null,
        inputs?.daysForward,
      );

      this.getSchedule$.next();
    }
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
    return indexOf(this.uniqueSeries, name) + 1; //+1 required here to align with scss indexing :(
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

      keys(groups).forEach(key => {
        const group = groups[key];
        group;
      });

      const eventGroups = Object.entries(groups).map(entry => {
        return {
          name: entry[0],
          events: entry[1],
          seriesColorIndex: this.getGroupIndex(entry[0]),
        } as EventGroup<RacersCupMeta>;
      });

      cell.eventGroups = eventGroups;
    });
  }

  /** Filter events. */
  public filterEvents(seriesPlaylistMap: Map<string, string[]>): void {
    const supportedSeries = [...seriesPlaylistMap.keys()];

    const sortedEvents = this.events.filter(event => {
      const seriesIndex = indexOf(supportedSeries, event.meta.seriesName);
      const isSeriesSupported = seriesIndex !== -1;
      const isPlaylistSupported =
        isSeriesSupported &&
        indexOf(seriesPlaylistMap.get(event.meta.seriesName), event.meta.playlistName) !== -1;

      return isPlaylistSupported;
    });

    this.filteredEvents = sortedEvents;

    const buildCsvResult = this.buildCsvData();
    this.calendarCsvData = buildCsvResult;
  }

  /** Builds the gifting results into CSV data that can be downloaded. */
  public buildCsvData(): string[][] {
    const newCalendarCsvData = [getOutlookCalendarHeaders()];

    for (const event of this.filteredEvents) {
      const eventStartDate = buildOutlookDateString(event.start);
      const eventStartTime = buildOutlookTimeString(event.start);
      const eventEndDate = buildOutlookDateString(event.end);
      const eventEndTime = buildOutlookTimeString(event.end);

      newCalendarCsvData[newCalendarCsvData.length] = [
        `\"${event.meta.eventNameClean}\"`, //Subject
        `\"${eventStartDate}\"`, //Start Date
        `\"${eventStartTime}\"`, //Start Time
        `\"${eventEndDate}\"`, // End Date
        `\"${eventEndTime}\"`, // End Time
        '"False"', // All Day Event?
        '"False"', // Reminder on?
        `\"${eventStartDate}\"`, // Reminder Date
        `\"${eventStartTime}\"`, // Reminder Time
        '"Racers Cup Schedule"', // Organizer
        null, // Required Attendees
        null, // Optional Attendees
        null, // Meeting Resources
        null, // Billing Information
        `\"Series: ${event.meta.seriesName}, Playlist: ${event.meta.playlistName}\"`, // Categories
        `\"\"`, // Description
        `\"${event.meta.courseName} - ${event.meta.circuitName}\"`,
        null, // Mileage
        '"Normal"', // Priority
        '"False"', // Private
        '"Normal"', // Sensitivity
        '"3"', // Show time as
      ];
    }

    return newCalendarCsvData;
  }

  /** Converts Racer's Cup Schedule information into Calendar Events. */
  private makeEvents(schedule: RacersCupSchedule): CalendarEvent[] {
    const events: CalendarEvent<RacersCupMeta>[] = [];
    const seriesPlaylistMapping = new Map<string, string[]>();
    for (const championship of schedule.championships) {
      // Build an ordered set of series for use sorting later.
      this.uniqueSeries = uniq(championship.series.map(series => series.name));

      for (const series of championship.series) {
        for (const event of series.events) {
          if (seriesPlaylistMapping.has(series.name)) {
            seriesPlaylistMapping.get(series.name).push(event.playlistName);
          } else {
            seriesPlaylistMapping.set(series.name, [event.playlistName]);
          }

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
                seriesColorIndex: this.getGroupIndex(series.name),
                playlistName: event.playlistName,
                eventNameRaw: event.name,
                eventNameClean: `${eventInfo.courseName}-${eventInfo.circuitName}`,
                courseName: eventInfo.courseName,
                circuitName: eventInfo.circuitName,
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

    // Clean out duplicates
    for (const keyValuePair of seriesPlaylistMapping) {
      seriesPlaylistMapping.set(keyValuePair[0], uniq(keyValuePair[1]));
    }
    this.playlistDictionary = seriesPlaylistMapping;

    return this.sortEvents(events);
  }

  /** Sorts Racer's Cup events by date. */
  private sortEvents(events: CalendarEvent<RacersCupMeta>[]): CalendarEvent<RacersCupMeta>[] {
    return sortBy(events, o => {
      return o.start;
    });
  }

  /** Extracts course name, circuit name, and id from CMS file name. */
  private seperateEventInfo(rawName: string): EventNameInfo {
    const splitEventName = rawName.split(' - ');
    if (splitEventName[0] === 'AutoGen') {
      splitEventName.shift();
    }
    return {
      courseName: splitEventName[0],
      circuitName: splitEventName[1],
    };
  }
}
