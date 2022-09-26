import { Component, Input } from '@angular/core';
import {
  CustomTileComponent,
  ExternalUrlDropdownEntry,
  HomeTileInfo,
  isHomeTileInfoMultiExternal,
} from '@environments/environment';

/** Displays a MutliExternal tile in the navbar as a menu. */
@Component({
  selector: 'external-dropdown',
  templateUrl: './external-dropdown.component.html',
  styleUrls: ['./external-dropdown.component.scss'],
})
export class ExternalDropdownComponent implements CustomTileComponent {
  /** REVIEW-COMMENT: Is the dropdown disabled. */
  @Input() public disabled: boolean;
  /** REVIEW-COMMENT: Item. */
  @Input() public item: HomeTileInfo;

  /** Safely produces the dropdown entry data. */
  public get entries(): ExternalUrlDropdownEntry[] {
    if (!isHomeTileInfoMultiExternal(this.item)) {
      throw new Error('External Dropdown component given incompatible item');
    }

    return this.item.externalUrls;
  }
}
