import { Component, Input } from '@angular/core';
import { CustomTileComponent, HomeTileInfo } from '@environments/environment';

/** Renders the tile content for the theme-app tile. */
@Component({
  templateUrl: './theme-tile-content.component.html',
  styleUrls: ['./theme-tile-content.component.scss'],
})
export class ThemeTileContentComponent implements CustomTileComponent {
  /** REVIEW-COMMENT: Is nav disabled. */
  @Input() public disabled: boolean;
  /** REVIEW-COMMENT: Nav item. */
  @Input() public item: HomeTileInfo;
}
