import { Component, Input } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { DriverLevelServiceContract } from '../driver-level.component';

/**
 *  Steelhead driver level component.
 */
@Component({
  selector: 'steelhead-driver-level',
  templateUrl: './steelhead-driver-level.component.html',
})
export class SteelheadDriverLevelComponent {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public service: DriverLevelServiceContract;

  constructor() {
    this.service = {
      gameTitle: GameTitle.FM8,
    };
  }
}
