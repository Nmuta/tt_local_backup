import { Component, Inject, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep } from 'lodash';
import { EMPTY, Observable } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { SteelheadEditUgcModalComponent } from './steelhead/steelhead-edit-ugc-modal.component';
import { WoodstockEditUgcModalComponent } from './woodstock/woodstock-edit-ugc-modal.component';
import { UgcEditInput } from '@models/ugc-edit-input';

/** Edit Ugc contract. */
export interface EditUgcContract {
  /** Get game title. */
  gameTitle: GameTitle;
  /** Get ugc item. */
  getUgcItem$(itemId: string, type: UgcType): Observable<PlayerUgcItem>;
  /** Edit ugc item. */
  editUgcItem$(itemId: string, ugcEditInput: UgcEditInput): Observable<void>;
}

export type EditUgcModalComponentUnion =
  | SteelheadEditUgcModalComponent
  | WoodstockEditUgcModalComponent;

/** Base modal component to edit a UGC item. */
@Component({
  selector: 'edit-ugc-modal',
  templateUrl: './edit-ugc-modal.component.html',
  styleUrls: ['./edit-ugc-modal.component.scss'],
  providers: [],
})
export class EditUgcModalBaseComponent extends BaseComponent {
  /** The edit ugc service. */
  @Input() public service: EditUgcContract;

  public formControls = {
    title: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl('', [Validators.required]),
  };
  public formGroup = new UntypedFormGroup(this.formControls);
  public postMonitor = new ActionMonitor('POST Edit UGC');
  public ugcItem: PlayerUgcItem;

  public supportedTypes = [
    UgcType.Livery,
    UgcType.LayerGroup,
    UgcType.Photo,
    UgcType.Tune,
    UgcType.EventBlueprint,
    UgcType.CommunityChallenge,
    UgcType.Replay,
  ];

  public editUgcPermAttribute = PermAttributeName.EditUgc;

  constructor(
    protected dialogRef: MatDialogRef<EditUgcModalBaseComponent>,
    @Inject(MAT_DIALOG_DATA) protected data: PlayerUgcItem,
  ) {
    super();

    this.ugcItem = cloneDeep(data);

    const isUnsupportedType = !this.supportedTypes.includes(data.type);

    if (isUnsupportedType) {
      dialogRef.close();
      throw new Error(
        `Bad UGC Type: ${
          data.type
        }. Editing UGC content is limited to types: ${this.supportedTypes.join(', ')}.`,
      );
    }

    dialogRef
      .beforeClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => dialogRef.close(this.ugcItem));

    this.formControls.title.setValue(data.title);
    this.formControls.description.setValue(data.description);
  }

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Edit ugc. */
  public editUgc(): void {
    if (!this.formGroup.valid) {
      return;
    }

    const ugcEditInput: UgcEditInput = {
      title: this.formControls.title.value,
      description: this.formControls.description.value,
    };
    this.postMonitor = this.postMonitor.repeat();
    this.dialogRef.disableClose = true;

    this.service
      .editUgcItem$(this.ugcItem.id, ugcEditInput)
      .pipe(
        this.postMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        switchMap(() => {
          return this.service.getUgcItem$(this.ugcItem.id, this.ugcItem.type);
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe((ugcItem: PlayerUgcItem) => {
        this.dialogRef.disableClose = false;
        this.ugcItem = ugcItem;
      });
  }
}
