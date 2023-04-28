import { Component, Input } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { RacersCupMeta } from '../racers-cup-calendar/racers-cup-calendar.component';

/** Modal component to display the changelog. */
@Component({
  selector: 'racers-cup-event-card',
  templateUrl: './racers-cup-event-card.component.html',
  styleUrls: ['./racers-cup-event-card.component.scss'],
})
export class RacersCupEventCardComponent {
  /** REVIEW-COMMENT: Calendar event. */
  @Input() public event: CalendarEvent<RacersCupMeta>;
}
