import { Component, EventEmitter, Output } from '@angular/core';
import { ApolloService } from '@services/apollo';
import { GravityService } from '@services/gravity';
import { OpusService } from '@services/opus';
import { SunriseService } from '@services/sunrise';
import { first } from 'lodash';
import {
  AugmentedCompositeIdentity,
  PlayerSelectionBaseComponent,
} from '../player-selection-base.component';

/** An inline user-picker with a bulk output. */
@Component({
  selector: 'player-selection-bulk',
  templateUrl: './player-selection-bulk.component.html',
  styleUrls: ['./player-selection-bulk.component.scss'],
})
export class PlayerSelectionBulkComponent extends PlayerSelectionBaseComponent {
  @Output() public found = new EventEmitter<AugmentedCompositeIdentity>();

  /** True when the input should be disabled */
  public get disable(): boolean {
    return this.knownIdentities.size >= 100;
  }

  constructor(
    sunrise: SunriseService,
    gravity: GravityService,
    apollo: ApolloService,
    opus: OpusService,
  ) {
    // normally, this could be deleted. but this fails to inject to the base class during code coverage checks. https://github.com/angular/angular-cli/issues/14860
    super(sunrise, gravity, apollo, opus);
  }

  /** Called when a new set of results is found and populated into @see foundIdentities */
  public onFound(): void {
    if (this.foundIdentities.length > 1) {
      throw new Error(`${this.constructor.name} was allowed to select multiple identities.`);
    }

    this.found.emit(first(this.foundIdentities));
  }
}
