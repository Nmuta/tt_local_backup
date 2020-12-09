import { Component, OnInit } from '@angular/core';

/** The sunrise gifting page for the Navbar app. */
@Component({
  templateUrl: './sunrise-gifting.component.html',
  styleUrls: ['./sunrise-gifting.component.scss'],
})
export class SunriseGiftingComponent implements OnInit { 
  /** Initialization hook */
  public ngOnInit(): void {
    // Empty
  }

  /** Logic when player selection outputs identities. */
  public selectedPlayerIndentities(event: unknown[]): void {
    console.log(event);
  }
}
