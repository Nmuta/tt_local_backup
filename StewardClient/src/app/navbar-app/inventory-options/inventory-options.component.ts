import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InventoryOptions } from '@shared/models/enums';

/** Defines the inventory options component. */
@Component({
  selector: 'inventory-options',
  templateUrl: './inventory-options.html',
  styleUrls: ['./inventory-options.scss'],
})
export class InventoryOptionsComponent implements OnInit {
  @Input() public groupGifting = true;
  @Output() public newOptionSelectedEvent = new EventEmitter();

  public selectedOption: number;
  public options: InventoryOptions[] = [
    InventoryOptions.UserGift,
    InventoryOptions.GroupGiftByXUID,
    InventoryOptions.GroupGiftByGamertag,
  ];

  constructor() {
    // Empty
  }

  get InventoryOptions(): typeof InventoryOptions {
    return InventoryOptions;
  }

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.selectedOption = 0;
    if (!this.groupGifting) {
      this.options = [InventoryOptions.UserGift];
    }
  }

  /** Selects a new inventory option. */
  public selectOption(optionIndex: number): void {
    this.selectedOption = optionIndex;
    this.newOptionSelectedEvent.emit(this.options[this.selectedOption]);
  }
}
