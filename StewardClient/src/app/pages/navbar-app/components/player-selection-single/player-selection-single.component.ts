import { Component, EventEmitter, Input, Output } from '@angular/core';
import { first } from 'lodash';
import { AugmentedCompositeIdentity, PlayerSelectionBaseComponent } from './player-selection-base.component';

/** An inline user-picker with a single output. */
@Component({
  selector: 'player-selection-single',
  templateUrl: './player-selection-single.component.html',
  styleUrls: ['./player-selection-single.component.scss'],
})
export class PlayerSelectionSingleComponent extends PlayerSelectionBaseComponent {
  @Output() public found = new EventEmitter<AugmentedCompositeIdentity>();

  /** True when the input should be disabled */
  public get disable(): boolean {
    return this.knownIdentities.size > 0;
  }

  /** Called when a new set of results is found and populated into @see foundIdentities */
  public onFound(): void {
    if (this.foundIdentities.length > 1) {
      throw new Error(`${this.constructor.name} was allowed to select multiple identities.`);
    }

    this.found.next(first(this.foundIdentities));
  }
}
