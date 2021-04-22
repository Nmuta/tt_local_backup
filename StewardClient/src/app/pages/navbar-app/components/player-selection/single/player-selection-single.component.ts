import {
  Component,
  ContentChild,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatChipList, MatChipListChange } from '@angular/material/chips';
import { ApolloService } from '@services/apollo';
import { GravityService } from '@services/gravity';
import { OpusService } from '@services/opus';
import { SteelheadService } from '@services/steelhead';
import { SunriseService } from '@services/sunrise';
import { first } from 'lodash';
import { takeUntil } from 'rxjs/operators';
import {
  AugmentedCompositeIdentity,
  PlayerSelectionBaseComponent,
} from '../player-selection-base.component';

/** An inline user-picker with a single output. */
@Component({
  selector: 'player-selection-single',
  templateUrl: './player-selection-single.component.html',
  styleUrls: ['./player-selection-single.component.scss'],
})
export class PlayerSelectionSingleComponent extends PlayerSelectionBaseComponent {
  @Output() public found = new EventEmitter<AugmentedCompositeIdentity>();
  @Output() public selected = new EventEmitter<AugmentedCompositeIdentity>();
  @ContentChild(TemplateRef) templateRef: TemplateRef<AugmentedCompositeIdentity>;
  @ViewChild('chipList') public chipList: MatChipList;

  protected selectedValue: AugmentedCompositeIdentity = null;

  /** True when the input should be disabled */
  public get disable(): boolean {
    return this.knownIdentities.size > 0;
  }

  constructor(
    steelhead: SteelheadService,
    sunrise: SunriseService,
    gravity: GravityService,
    apollo: ApolloService,
    opus: OpusService,
  ) {
    // normally, this could be deleted. but this fails to inject to the base class during code coverage checks. https://github.com/angular/angular-cli/issues/14860
    super(steelhead, sunrise, gravity, apollo, opus);
    this.foundIdentities$.pipe(takeUntil(this.onDestroy$)).subscribe(foundIdentities => {
      if (foundIdentities.length > 1) {
        throw new Error(`${this.constructor.name} was allowed to find multiple identities.`);
      }

      const foundIdentity = first(foundIdentities);
      this.found.emit(foundIdentity);

      const selectedItemInFoundIdentities = foundIdentities.includes(this.selectedValue);
      if (!selectedItemInFoundIdentities) {
        this.selected.next(null);
      } else {
        this.selected.next(this.selectedValue);
      }
    });
  }

  /** Called when a new set of results is selected. */
  public onSelect(change: MatChipListChange): void {
    this.selectedValue = change.value as AugmentedCompositeIdentity;
    this.selected.next(this.selectedValue);
  }
}
