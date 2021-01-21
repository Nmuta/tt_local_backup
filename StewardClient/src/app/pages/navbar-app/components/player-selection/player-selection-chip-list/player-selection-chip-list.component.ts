import { AfterContentChecked, AfterContentInit, Component, ContentChild, ContentChildren, Input, OnChanges, OnInit, QueryList, SimpleChanges, TemplateRef } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { cloneDeep } from 'lodash';
import { PlayerSelectionChipComponent } from '../player-selection-chip/player-selection-chip.component';
import { PlayerSelectionBaseComponent } from '../player-selection.base.component';

interface Augmentation {
  extra: {
    isValid: boolean;
    theme: 'primary'|'accent'|'warn';
    name: string;
    nameTooltip: string;
  }
}

type EitherIdentityResult = IdentityResultAlpha | IdentityResultBeta;
type EitherIdentityResultAugmented = EitherIdentityResult & Augmentation;

@Component({
  selector: 'player-selection-chip-list',
  templateUrl: './player-selection-chip-list.component.html',
  styleUrls: ['./player-selection-chip-list.component.scss']
})
export class PlayerSelectionChipListComponent implements OnInit, OnChanges {
  @ContentChild(TemplateRef) public template: TemplateRef<any>;

  @Input() public playerSelection: PlayerSelectionBaseComponent<IdentityResultAlpha | IdentityResultBeta> = null;
  @Input() public identities: EitherIdentityResult[] = [];
  public augmentedIdentities: EitherIdentityResultAugmented[] = [];

  public closeIcon = faTimesCircle;
  
  constructor() { }

  /** Lifecycle hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    if (!this.identities) {
      this.augmentedIdentities = [];
      return;
    }

    this.augmentedIdentities = this.identities.map(i => {
      const identity = cloneDeep(i) as EitherIdentityResultAugmented;

      const isValid = !identity.error
      const name = identity[this.playerSelection.playerIdType];

      identity.extra = {
        isValid: isValid,
        theme: isValid ? 'primary' : 'warn',
        name: name,
        nameTooltip: name,
      };
      
      if (!identity.extra.isValid) {
        identity.extra.nameTooltip += ' (invalid)';
      }

      return identity;
    });
  }

  public ngOnInit(): void {
  }

}
