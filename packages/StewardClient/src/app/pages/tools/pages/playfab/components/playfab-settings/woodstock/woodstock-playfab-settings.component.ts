import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';

/** Displays the Woodstock playfab settings tool. */
@Component({
  selector: 'woodstock-playfab-settings',
  templateUrl: './woodstock-playfab-settings.component.html',
  styleUrls: ['./woodstock-playfab-settings.component.scss'],
})
export class WoodstockPlayFabSettingsComponent {
  public title = GameTitle.FH5;
}
