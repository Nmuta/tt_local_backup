import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RacersCupQualificationLimitType } from '@models/racers-cup.model';
import { CalendarEvent } from 'angular-calendar';
import { RacersCupMeta } from '../racers-cup-calendar/racers-cup-calendar.component';

export type RacersCupSeriesModalData = { name: string; events: CalendarEvent<RacersCupMeta>[] };

/** Modal component to display the Racers cup event. */
@Component({
  templateUrl: './racers-cup-series-modal.component.html',
  styleUrls: ['./racers-cup-series-modal.component.scss'],
})
export class RacersCupSeriesModalComponent {
  public seriesName: string;
  public eventGroup: CalendarEvent<RacersCupMeta>[];
  public selectedEvent: CalendarEvent<RacersCupMeta>;
  public RacersCupQualificationLimitType = RacersCupQualificationLimitType;

  constructor(
    protected dialogRef: MatDialogRef<RacersCupSeriesModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: RacersCupSeriesModalData,
  ) {
    this.seriesName = data.name;
    this.eventGroup = data.events;
  }

  /** Handles clicking on event cards. */
  public onEventCardClick(event: CalendarEvent<RacersCupMeta>): void {
    if (event === this.selectedEvent) {
      this.selectedEvent = null;
    } else {
      this.selectedEvent = event;
    }
  }
}
