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
    { duration: moment.duration(1, 'week'), humanized: '1 week' },
    { duration: moment.duration(1, 'month'), humanized: '1 month' },
    { duration: moment.duration(20, 'years'), humanized: '20 years' },
  ];
}
