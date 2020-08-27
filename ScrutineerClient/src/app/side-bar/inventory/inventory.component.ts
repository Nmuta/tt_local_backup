import { Component, Input } from "@angular/core";
import { InventoryOptions } from "@shared/models/enums";

/** Defines the inventory component. */
@Component({
  selector: "inventory",
  templateUrl: "./inventory.html",
  styleUrls: ["./inventory.scss"],
})
export class InventoryComponent {
  @Input() public selectedGiftingOption: InventoryOptions;

  constructor() {
    // Empty
  }
}
