import { Component, Input } from '@angular/core';
import { CustomTileComponent } from '@environments/environment';

/** Renders the tile content for the theme-app tile. */
@Component({
  templateUrl: './theme-tile-content.component.html',
  styleUrls: ['./theme-tile-content.component.scss'],
})
export class ThemeTileContentComponent implements CustomTileComponent {
  @Input() public disabled: boolean;
}
