import { Component, Output, EventEmitter } from '@angular/core';
import {
  MatCheckboxDefaultOptions,
  MAT_CHECKBOX_DEFAULT_OPTIONS,
} from '@angular/material/checkbox';
import { ShowroomEventType } from '../showroom-calendar-view/steelhead/steelhead-showroom-calendar-view.component';

/**
 * Node for Showroom Key items.
 */
export class ShowroomKeyNode {
  isChecked: boolean;
  showroomEventType: string;
}

/** Modal component to display Showroom key. */
@Component({
  selector: 'showroom-key',
  templateUrl: './showroom-key.component.html',
  styleUrls: ['./showroom-key.component.scss'],
  providers: [
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions,
    },
  ],
})
export class ShowroomKeyComponent {
  /** Output when results are filtered. */
  @Output() public filterResults = new EventEmitter<ShowroomEventType[]>();

  public eventTypes: ShowroomEventType[] = Object.values(ShowroomEventType);
  public checkedEventTypes: ShowroomEventType[] = Object.values(ShowroomEventType);

  /** Checks if a showroom event type is checked. */
  public isChecked(showroomEventType: ShowroomEventType): boolean {
    return this.checkedEventTypes.includes(showroomEventType);
  }

  /** Toggle a showroom event type filter. */
  public toggleChecked(showroomEventType: ShowroomEventType): void {
    const index = this.checkedEventTypes.indexOf(showroomEventType);
    if (index === -1) {
      this.checkedEventTypes.push(showroomEventType);
    } else {
      this.checkedEventTypes.splice(index, 1);
    }

    this.filterResults.emit(this.checkedEventTypes);
  }

  /** Toggle all nodes on/off. */
  public toggleAll(toggleOn: boolean): void {
    if (toggleOn) {
      this.checkedEventTypes = Object.values(ShowroomEventType);
    } else {
      this.checkedEventTypes = [];
    }

    this.filterResults.emit(this.checkedEventTypes);
  }
}
