import { Component } from '@angular/core';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './apollo-gifting.component.html',
  styleUrls: ['./apollo-gifting.component.scss'],
})
export class ApolloGiftingComponent {

  /** Logic when player selection outputs identities. */
  public selectedPlayerIndentities(event: unknown[]): void {
    console.log(event);
  }
}
