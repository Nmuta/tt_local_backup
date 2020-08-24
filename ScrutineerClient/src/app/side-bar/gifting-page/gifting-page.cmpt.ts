import { Component, Input } from '@angular/core';
import { InventoryOptions, GameTitleNames } from '@shared/models/enums';

@Component({
    selector: 'gifting-page',
    templateUrl: './gifting-page.html',
    styleUrls: ['./gifting-page.scss']
})
export class GiftingPageComponent {
    @Input() gameTitle: GameTitleNames;
    public selectedGiftingOption: InventoryOptions = InventoryOptions.UserGift;

    constructor() {}

    public newGiftingOptionSelected(event: InventoryOptions) {
        this.selectedGiftingOption = event;
    }
}
