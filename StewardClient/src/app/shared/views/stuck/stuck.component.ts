import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { delay, startWith } from 'rxjs/operators';

/** Displays a "stuck" warning after some period of time. */
@Component({
  selector: 'stuck',
  templateUrl: './stuck.component.html',
  styleUrls: ['./stuck.component.scss']
})
export class StuckComponent {
  /** Emits true when the interval has passed. */
  public shouldShow$ = of(true).pipe(delay(10_000), startWith(false));
}
