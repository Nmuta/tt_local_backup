import { Component } from '@angular/core';
import * as moment from 'moment';

/** Allows selection of a duration */
@Component({
  selector: 'duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.scss']
})
export class DurationPickerComponent {

  public options = [
    { duration: moment.duration(1, 'week'), humanized: '' },
    { duration: moment.duration(1, 'month'), humanized: '' },
    { duration: moment.duration(20, 'years'), humanized: '' },
  ]

  constructor() {
    for (const option of this.options) {
      option.humanized = option.duration.humanize();
    }
  }
}
