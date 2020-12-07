import { Component } from '@angular/core';
import { GameTitleCodeNames } from '@models/enums';

/** The gifting page for the Navbar app. */
@Component({
  selector: 'app-gifting',
  templateUrl: './gifting.component.html',
  styleUrls: ['./gifting.component.scss'],
})
export class GiftingComponent {
  gameTitleOptions = [
    GameTitleCodeNames.Street,
    GameTitleCodeNames.FH4,
    GameTitleCodeNames.FM7,
    GameTitleCodeNames.FH3
  ];

  /** Logic when a new game title is selected */
  public newGameTitleSelected(title: GameTitleCodeNames): void {
    console.log(title);
  }
}
