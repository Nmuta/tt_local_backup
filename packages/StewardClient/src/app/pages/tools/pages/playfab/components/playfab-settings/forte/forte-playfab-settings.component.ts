import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';

/** Displays the Forte playfab settings tool. */
@Component({
  selector: 'forte-playfab-settings',
  templateUrl: './forte-playfab-settings.component.html',
  styleUrls: ['./forte-playfab-settings.component.scss'],
})
export class FortePlayFabSettingsComponent {
  public title = GameTitle.Forte;
}
