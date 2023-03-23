import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RacersCupQualificationLimitType } from '@models/racers-cup.model';
import { CalendarEvent } from 'angular-calendar';
import { BuildersCupMeta } from '../../builders-cup-calendar-view/steelhead/steelhead-builders-cup-calendar-view.component';

export type SteelheadBuildersCupLadderModalData = {
  name: string;
  events: CalendarEvent<BuildersCupMeta>[];
};

/** Modal component to display the Racers cup event. */
@Component({
  templateUrl: './steelhead-builders-cup-ladder-modal.component.html',
  styleUrls: ['./steelhead-builders-cup-ladder-modal.component.scss'],
})
export class SteelheadBuildersCupLadderModalComponent {
  public ladderName: string;
  public eventGroup: CalendarEvent<BuildersCupMeta>[];
  public selectedEvent: CalendarEvent<BuildersCupMeta>;
  public RacersCupQualificationLimitType = RacersCupQualificationLimitType;

  constructor(
    protected dialogRef: MatDialogRef<SteelheadBuildersCupLadderModalComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: SteelheadBuildersCupLadderModalData,
  ) {
    this.ladderName = data.name;
    this.eventGroup = data.events;
  }

  /** Handles clicking on event cards. */
  public onEventCardClick(event: CalendarEvent<BuildersCupMeta>): void {
    if (event === this.selectedEvent) {
      this.selectedEvent = null;
    } else {
      this.selectedEvent = event;
    }
  }
}
