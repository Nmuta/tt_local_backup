import { Component } from '@angular/core';

/** The opus gifting page for the Navbar app. */
@Component({
  templateUrl: './opus-gifting.component.html',
  styleUrls: ['./opus-gifting.component.scss'],
})
export class OpusGiftingComponent {

  /** Logic when player selection outputs identities. */
  public selectedPlayerIndentities(event: unknown[]): void {
    console.log(event);
  }
}
