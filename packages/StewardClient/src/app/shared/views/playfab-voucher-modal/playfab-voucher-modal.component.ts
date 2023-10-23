import { Component, Input, OnChanges } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { BaseComponent } from '@components/base-component/base.component';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { UgcOperationSnackbarComponent } from '@tools-app/pages/ugc-details/components/ugc-action-snackbar/ugc-operation-snackbar.component';
import { EMPTY, Observable } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { PlayFabProfile } from '@services/api-v2/woodstock/players/playfab/woodstock-players-playfab.service';
import { PlayFabCollectionId, PlayFabVoucher } from '@models/playfab';
import BigNumber from 'bignumber.js';
import { GameTitle } from '@models/enums';
import { PlayFabInventoryServiceContract } from '@views/playfab-player-tools/components/playfab-inventory/playfab-inventory.component';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { MasterInventoryUnion } from '@models/master-inventory-item';
import { countBy } from 'lodash';

export interface PlayFabVoucherModalServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Gets PlayFab Player Id. */
  getPlayFabProfile$(xuid: BigNumber): Observable<PlayFabProfile>;
/** Gets PlayFab Vouchers Id. */
  getPlayFabVouchers$(): Observable<PlayFabVoucher[]>;
  /** PlayFab inventory service contract */
  inventoryService: PlayFabInventoryServiceContract;
}

/** Modal component for sending users Playfab Vouchers. */
@Component({
  selector: 'playfab-voucher-modal',
  templateUrl: './playfab-voucher-modal.component.html',
  styleUrls: ['./playfab-voucher-modal.component.scss'],
})
export class PlayfabVoucherModalComponent extends BaseComponent implements OnChanges {
  /** Service used to persist UGC. */
  @Input() service: PlayFabVoucherModalServiceContract;
  
  /** Player XUID. */
  @Input() xuid: BigNumber;

    /** Reference Inventory. */
    @Input() referenceInventory: MasterInventoryUnion;

  public getPlayFabProfileMonitor = new ActionMonitor('Get PlayFab player id');
  public postMonitor = new ActionMonitor('POST Send Playfab Vouchers');
  public sendVouchersPermAttribute = PermAttributeName.ManagePlayFabInventory;

  public playFabProfile: PlayFabProfile;
  public playFabVouchers: PlayFabVoucher[];

  public ugcOperationSnackbarComponent = UgcOperationSnackbarComponent;

  public readonly PlayFabCollectionId = PlayFabCollectionId;
  public collectionId: PlayFabCollectionId = PlayFabCollectionId.Default;

  constructor(protected dialogRef: MatDialogRef<PlayfabVoucherModalComponent>) {
    super();
  }

  /** Initialization hook. */
  public ngOnChanges(changes: BetterSimpleChanges<PlayfabVoucherModalComponent>): void {
    if (!changes.xuid) {
      return;
    }

    //TEST CODE REMOVE!!!!TEST CODE REMOVE!!!!TEST CODE REMOVE!!!!
    this.xuid = new BigNumber(2814674538477037);
    //TEST CODE REMOVE!!!!TEST CODE REMOVE!!!!TEST CODE REMOVE!!!!

    this.service.getPlayFabProfile$(this.xuid)
      .subscribe(profile => {
        this.playFabProfile = profile;
        this.service.getPlayFabVouchers$()
          .subscribe(vouchers => {
            this.playFabVouchers = vouchers;

            console.log(this.referenceInventory);

            const carVoucherCount = countBy(this.referenceInventory.cars, car => car.  )
          });
      });
  }

  /** Send Playfab vouchers to user. */
  public sendVouchers(): void {
    const itemId = 'test';
    const quantity = 3;


    this.postMonitor = this.postMonitor.repeat();
    this.dialogRef.disableClose = true;
    // this.service.inventoryService.addPlayFabItem$(
    //   profile.title,
    //   this.collectionId,
    //   itemId,
    //   new BigNumber(quantity),
    // )
    // .pipe(
    //   this.postMonitor.monitorSingleFire(),
    //   catchError(() => EMPTY),
    //   takeUntil(this.onDestroy$),
    // )
    // .subscribe(_ => (this.dialogRef.disableClose = false));

  }
}
