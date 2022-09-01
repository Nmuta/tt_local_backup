import { Component } from '@angular/core';
import { DateTime } from 'luxon';

/** Displays the home page splash page. */
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public centerContentsClasses = {};
  constructor() {
    const dayOfWeek = DateTime.local().weekday - 1;
    const weekOfYear = DateTime.local().weekNumber;
    const whichBackground = ((weekOfYear + dayOfWeek) % 7) + 1;
    this.centerContentsClasses = { 'text-center': true, [`bg${whichBackground}`]: true };
  }
}
