import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

/** A base chip for the player selection component. */
@Component({
  selector: 'player-selection-chip',
  templateUrl: './player-selection-chip.component.html',
  styleUrls: ['./player-selection-chip.component.scss']
})
export class PlayerSelectionChipComponent implements OnChanges {
  @Input() public playerSelection: PlayerSelectionBaseComponent<IdentityResultAlpha | IdentityResultBeta> = null;
  @Input() public identity: IdentityResultAlpha | IdentityResultBeta = null;

  public name = '';
  public nameTooltip = '';

  public closeIcon = faTimesCircle;

  /** Angular hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    this.name = this.identity[this.playerSelection.playerIdType];
    this.nameTooltip = this.name;
    if (!!this.identity.error) {
      this.nameTooltip += ' (invalid)';
    }
  }
}
