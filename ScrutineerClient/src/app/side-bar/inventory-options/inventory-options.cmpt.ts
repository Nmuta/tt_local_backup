import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InventoryOptions } from '@shared/models/enums';

/** Inventory Options component */
@Component({
    selector: 'inventory-options',
    templateUrl: './inventory-options.html',
    styleUrls: ['./inventory-options.scss']
})
export class InventoryOptionsComponent implements OnInit {

    @Input() groupGifting = true;
    @Output() newOptionSelectedEvent = new EventEmitter();

    selectedOption: number;
    options: InventoryOptions[] = [
        InventoryOptions.UserGift,
        InventoryOptions.GroupGiftByXUID,
        InventoryOptions.GroupGiftByGamertag
    ];

    constructor() {
        // Empty
    }

    get InventoryOptions() { return InventoryOptions; }

    /** ngOnInit method */
    public ngOnInit() {
        this.selectedOption = 0;
        if (!this.groupGifting) {
            this.options = [ InventoryOptions.UserGift ];
        }
    }

    /** Selects a new option */
    public selectOption(optionIndex) {
        this.selectedOption = optionIndex;
        this.newOptionSelectedEvent.emit(this.options[this.selectedOption]);
    }
}
