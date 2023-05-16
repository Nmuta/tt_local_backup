import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { PersistedItemResult, PlayerUgcItem, UgcOperationResult } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { UgcOperationSnackbarComponent } from '@tools-app/pages/ugc-details/components/ugc-action-snackbar/ugc-operation-snackbar.component';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

export interface PersistUgcService {
  title: GameTitle,
  getUgcItem$: (itemId: string, type: UgcType) => Observable<PlayerUgcItem>
  persistUgc$: (
    itemId: string,
    title: string,
    description: string,
  ) => Observable<PersistedItemResult>;
}

/** Base component to persist a UGC item. */
@Component({
  selector: 'persist-ugc-modal',
  templateUrl: './persist-ugc-modal.component.html',
  styleUrls: ['./persist-ugc-modal.component.scss'],
})

export class PersistUgcModalComponent extends BaseComponent{
  /** Service used to persist UGC. */
  @Input() service: PersistUgcService;

  /** UGC item to persist. */
  @Input() ugcItem: PlayerUgcItem;

  public formControls = {
    title: new FormControl(''),
    description: new FormControl(''),
  };
  public formGroup = new FormGroup(this.formControls);
  public postMonitor = new ActionMonitor('POST Persist UGC');
  public persistUgcPermAttribute = PermAttributeName.PersistUgc;

  public ugcOperationSnackbarComponent = UgcOperationSnackbarComponent;

  constructor(
  ) {
    super();
  }

  /** Sets featured status. */
  public persistUgc(): void {
    if (!this.formGroup.valid) {
      return;
    }

    this.postMonitor = this.postMonitor.repeat();

    this.service.persistUgc$(
      this.ugcItem.id,
      this.formControls.title.value,
      this.formControls.description.value,
    )
    .pipe(
      // The custom success snackbar expects a UgcOperationResult as the monitor value
      // Mapping must be done above the monitor single fire for it to use mapped result
      map(
        result =>
          ({
            gameTitle: GameTitle.FH5,
            fileId: result.newFileId,
            allowOpenInNewTab: true,
          } as UgcOperationResult),
      ),
      this.postMonitor.monitorSingleFire(),
      takeUntil(this.onDestroy$),
    )
    .subscribe();
  }
}
