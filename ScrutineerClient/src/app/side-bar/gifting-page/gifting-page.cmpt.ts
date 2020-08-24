import { Component, Input } from '@angular/core';
import { GameTitleNames, InventoryOptions } from '@shared/models/enums';

/** Gifting Page component */
@Component({
    selector: 'gifting-page',
    templateUrl: './gifting-page.html',
    styleUrls: ['./gifting-page.scss']
})
export class GiftingPageComponent {
    @Input() gameTitle: GameTitleNames;
    public selectedGiftingOption: InventoryOptions = InventoryOptions.UserGift;

    constructor() {
        // Empty
    }

    /** Select a new gifting option */
    public newGiftingOptionSelected(event: InventoryOptions) {
        this.selectedGiftingOption = event;
    }
}
