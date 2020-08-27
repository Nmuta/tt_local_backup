import { Component, Input } from "@angular/core";
import { GameTitleNames, InventoryOptions } from "@shared/models/enums";

/** Defines the gifting page component. */
@Component({
  selector: "gifting-page",
  templateUrl: "./gifting-page.html",
  styleUrls: ["./gifting-page.scss"],
})
export class GiftingPageComponent {
  @Input() public gameTitle: GameTitleNames;
  public selectedGiftingOption: InventoryOptions = InventoryOptions.UserGift;

  constructor() {
    // Empty
  }

  /** Select a new gifting option. */
  public newGiftingOptionSelected(event: InventoryOptions) {
    this.selectedGiftingOption = event;
  }
}
