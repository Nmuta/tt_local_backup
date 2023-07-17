import { Component } from '@angular/core';
import { WindowService } from '@services/window';

/** The 404 page. */
@Component({
  selector: 'four-oh-four',
  templateUrl: './four-oh-four.component.html',
  styleUrls: ['./four-oh-four.component.scss'],
})
export class FourOhFourComponent {
  constructor(private readonly window: WindowService) {}

  /** Produces the current location, for reference when in iframe. */
  public get location(): string {
    return `${this.window.location().pathname}${this.window.location().search}`;
  }
}
