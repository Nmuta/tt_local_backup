import {
  Component,
  ContentChild,
  EventEmitter,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatChipList, MatChipListChange } from '@angular/material/chips';
import { renderGuard } from '@helpers/rxjs';
import { MultiEnvironmentService } from '@services/multi-environment/multi-environment.service';
import { delay, takeUntil } from 'rxjs/operators';
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
  @Output() public found = new EventEmitter<AugmentedCompositeIdentity[]>();
  @Output() public selected = new EventEmitter<AugmentedCompositeIdentity>();
  @ContentChild(TemplateRef) templateRef: TemplateRef<AugmentedCompositeIdentity>;
  @ViewChild('chipList') public chipList: MatChipList;

  protected selectedValue: AugmentedCompositeIdentity = null;

  /** True when the input should be disabled */
  public get disable(): boolean {
    return this.knownIdentities.size >= 500;
  }

  constructor(multi: MultiEnvironmentService) {
    super(multi);
    this.foundIdentities$.pipe(delay(0), takeUntil(this.onDestroy$)).subscribe(foundIdentities => {
      this.found.emit(foundIdentities);
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

  /** Called when the "Clear" button is pressed */
  public onClear(): void {
    renderGuard(() => {
      this.knownIdentities.clear();
      this.foundIdentities = [];
      this.selectedValue = null;
      this.foundIdentities$.next(this.foundIdentities);
    });
  }
}
