import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultUnion } from '@models/identity-query.model';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

/** A base chip for the player selection component. */
@Component({
  selector: 'player-selection-chip',
  templateUrl: './player-selection-chip.component.html',
  styleUrls: ['./player-selection-chip.component.scss'],
})
export class PlayerSelectionChipComponent implements OnChanges {
  @Input() public playerSelection: PlayerSelectionBaseComponent<IdentityResultUnion> = null;
  @Input() public identity: IdentityResultUnion = null;

  @ViewChild('chip') public chip: MatChip;

  public name = '';
  public nameTooltip = '';
  public selected = false;
  public theme = null;

  public closeIcon = faTimesCircle;

  /** Angular hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    this.name = this.identity[this.playerSelection.playerIdType];
    this.nameTooltip = this.name;
    this.theme = !this.identity.error ? 'primary' : 'warn';
    if (!!this.identity.error) {
      this.nameTooltip += ' (invalid)';
    }
  }
}
