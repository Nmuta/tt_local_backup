import {
  Component,
  ContentChild,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatChipList, MatChipListChange } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { renderDelay, renderGuard } from '@helpers/rxjs';
import { MultiEnvironmentService } from '@services/multi-environment/multi-environment.service';
import { first } from 'lodash';
import { delay, takeUntil } from 'rxjs/operators';
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
  @ContentChild(TemplateRef) templateRef: TemplateRef<AugmentedCompositeIdentity>;
  @ViewChild('chipList') public chipList: MatChipList;

  protected selectedValue: AugmentedCompositeIdentity = null;
  public maxFoundIndentities: number = 1;

  /** True when the input should be disabled */
  public get disable(): boolean {
    return this.knownIdentities.size > 0;
  }

  constructor(multi: MultiEnvironmentService, route: ActivatedRoute, router: Router) {
    super(multi, route, router);
    this.foundIdentities$.pipe(renderDelay(), takeUntil(this.onDestroy$)).subscribe(foundIdentities => {
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
    renderGuard(() => {
      this.selectedValue = change.value as AugmentedCompositeIdentity;
      this.selected.next(this.selectedValue);
    });
  }
}
