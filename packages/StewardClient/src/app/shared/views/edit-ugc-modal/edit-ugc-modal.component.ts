import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { PlayerUgcItem } from '@models/player-ugc-item';
import { UgcType } from '@models/ugc-filters';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep } from 'lodash';
import { EMPTY, Observable, combineLatest } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { SteelheadEditUgcModalComponent } from './steelhead/steelhead-edit-ugc-modal.component';
import { WoodstockEditUgcModalComponent } from './woodstock/woodstock-edit-ugc-modal.component';
import { UgcEditInput } from '@models/ugc-edit-input';
import { UgcEditStatsInput } from '@models/ugc-edit-stats-input';

/** Edit Ugc contract. */
export interface EditUgcContract {
  /** Get game title. */
  gameTitle: GameTitle;
  /** Ugc Title Max Length. */
  titleMaxLength: number;
  /** Ugc Description Max Length. */
  descriptionMaxLength: number;
  /** Get ugc item. */
  getUgcItem$(itemId: string, type: UgcType): Observable<PlayerUgcItem>;
  /** Edit ugc item. */
  editUgcItem$(itemId: string, ugcEditInput: UgcEditInput): Observable<void>;
  /** Edit ugc item stats. */
  editUgcItemStats$(itemId: string, ugcEditStatsInput: UgcEditStatsInput): Observable<void>;
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
export class EditUgcModalBaseComponent extends BaseComponent implements OnInit {
  /** The edit ugc service. */
  @Input() public service: EditUgcContract;

  public formControls = {
    title: new UntypedFormControl('', [Validators.required]),
    description: new UntypedFormControl('', [Validators.required]),
    downloaded: new UntypedFormControl('', [Validators.required]),
    liked: new UntypedFormControl('', [Validators.required]),
    disliked: new UntypedFormControl('', [Validators.required]),
    used: new UntypedFormControl('', [Validators.required]),
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
    UgcType.PropPrefab,
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
    this.formControls.downloaded.setValue(data.timesDownloaded);
    this.formControls.liked.setValue(data.timesLiked);
    this.formControls.disliked.setValue(data.timesDisliked);
    this.formControls.used.setValue(data.timesUsed);
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.formControls.title.addValidators(Validators.maxLength(this.service.titleMaxLength));
    this.formControls.description.addValidators(
      Validators.maxLength(this.service.descriptionMaxLength),
    );
  }

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Edit ugc. */
  public editUgc(): void {
    if (!this.formGroup.valid && !this.isUgcInfoDirty() && !this.isUgcStatsDirty()) {
      return;
    }

    const editObservables: Observable<void>[] = [];

    if (this.isUgcInfoDirty()) {
      const ugcEditInput: UgcEditInput = {
        title: this.formControls.title.value,
        description: this.formControls.description.value,
      };
      editObservables.push(this.service.editUgcItem$(this.ugcItem.id, ugcEditInput));
    }

    if (this.isUgcStatsDirty()) {
      const ugcEditStatsInput: UgcEditStatsInput = {
        downloaded: Math.max(
          this.formControls.downloaded.value - this.ugcItem.timesDownloaded.toNumber(),
          0,
        ),
        liked: Math.max(this.formControls.liked.value - this.ugcItem.timesLiked.toNumber(), 0),
        disliked: Math.max(
          this.formControls.disliked.value - this.ugcItem.timesDisliked.toNumber(),
          0,
        ),
        used: Math.max(this.formControls.used.value - this.ugcItem.timesUsed.toNumber(), 0),
      };
      editObservables.push(this.service.editUgcItemStats$(this.ugcItem.id, ugcEditStatsInput));
    }

    this.postMonitor = this.postMonitor.repeat();
    this.dialogRef.disableClose = true;

    combineLatest(editObservables)
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

  /** Checks if general ugc info are dirty. */
  public isUgcInfoDirty(): boolean {
    return this.formControls.title.dirty || this.formControls.description.dirty;
  }

  /** Checks if ugc stats are dirty. */
  public isUgcStatsDirty(): boolean {
    return (
      this.formControls.downloaded.dirty ||
      this.formControls.liked.dirty ||
      this.formControls.disliked.dirty ||
      this.formControls.used.dirty
    );
  }
}
