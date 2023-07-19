import { Component, Input } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { BuildersCupMeta } from '../../builders-cup-calendar-view/steelhead/steelhead-builders-cup-calendar-view.component';

/** Modal component to display the changelog. */
@Component({
  selector: 'steelhead-builders-cup-series-card',
  templateUrl: './steelhead-builders-cup-series-card.component.html',
  styleUrls: ['./steelhead-builders-cup-series-card.component.scss'],
})
export class SteelheadBuildersCupSeriesCardComponent {
  /** Calendar event for Builder's Cup. */
  @Input() public event: CalendarEvent<BuildersCupMeta>;
}
