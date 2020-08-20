import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { InventoryOptions } from '@shared/models/enums';

@Component({
    selector: 'inventory-options',
    templateUrl: './inventory-options.html',
    styleUrls: ['./inventory-options.scss']
})
export class InventoryOptionsComponent implements OnInit {
    get InventoryOptions() { return InventoryOptions; }

    @Input() groupGifting = true;
    @Output() newOptionSelectedEvent = new EventEmitter();

    selectedOption: number;
    options: InventoryOptions[] = [
        InventoryOptions.UserGift,
        InventoryOptions.GroupGiftByXUID,
        InventoryOptions.GroupGiftByGamertag
    ];

    constructor() {}

    public ngOnInit() {
        this.selectedOption = 0;
        if (!this.groupGifting) {
            this.options = [ InventoryOptions.UserGift ];
        }
    }

    public selectOption(optionIndex) {
        this.selectedOption = optionIndex;
        this.newOptionSelectedEvent.emit(this.options[this.selectedOption]);
    }
}