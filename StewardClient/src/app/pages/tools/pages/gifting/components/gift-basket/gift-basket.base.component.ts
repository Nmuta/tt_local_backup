import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultUnion } from '@models/identity-query.model';
import { GameTitle, UserRole } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt, faPencilAlt, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { MasterInventoryItem, MasterInventoryUnion } from '@models/master-inventory-item';
import { GiftResponse } from '@models/gift-response';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { catchError, delayWhen, retryWhen, take, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, Observable, timer } from 'rxjs';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { GravityGift } from '@models/gravity';
import { SunriseGift } from '@models/sunrise';
import { ApolloGift } from '@models/apollo';
import { Store } from '@ngxs/store';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';
import { MatSelectChange } from '@angular/material/select';
import { DateTime } from 'luxon';
import { DateValidators } from '@shared/validators/date-validators';
import { tryParseBigNumber } from '@helpers/bignumbers';
import _ from 'lodash';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';
import { SteelheadGift } from '@models/steelhead';
import { WoodstockGift } from '@models/woodstock';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';

export type InventoryItemGroup = {
  category: string;
  items: MasterInventoryItem[];
};
export type GiftUnion = SteelheadGift | WoodstockGift | GravityGift | SunriseGift | ApolloGift;
export type GiftBasketModel = MasterInventoryItem & { edit?: boolean; restriction?: string };
export enum GiftReason {
  LostSave = 'Lost Save',
  AuctionHouse = 'Auction House',
  CommunityGift = 'Community Gift',
  GameError = 'Game Error',
  SaveRollback = 'Save Rollback',
}

/** The base gift-basket component. */
@Component({
  template: '',
})
export abstract class GiftBasketBaseComponent<
    IdentityT extends IdentityResultUnion,
    MasterInventoryT extends MasterInventoryUnion,
  >
  extends BaseComponent
  implements OnChanges
{
  /** Player identities to gift to. */
  @Input() public playerIdentities: IdentityT[];
  /** LSP group to gift to. */
  @Input() public lspGroup: LspGroup;
  /** Whether component is using player identities. False means LSP group. */
  @Input() public usingPlayerIdentities: boolean;
  /** Reference inventory to auto-fill the gift basket with.*/
  @Input() public referenceInventory: MasterInventoryT;

  /** User profile. */
  public profile: UserModel;
  /** True if max credit limit should be ignored. */
  public ignoreMaxCreditLimit: boolean = false;

  /** Master inventory list. */
  public masterInventory: MasterInventoryT;
  /** Item selection list. */
  public itemSelectionList: MasterInventoryT;
  /** The gift basket of current items to be send. */
  public giftBasket = new MatTableDataSource<GiftBasketModel>();
  /** Whether the gift basket has errors in it. */
  public giftBasketHasErrors: boolean = false;
  /** Gifting response. */
  public giftResponse: GiftResponse<BigNumber | string>[];
  /** The gift basket display columns */
  public displayedColumns: string[] = ['itemId', 'description', 'quantity', 'itemType', 'remove'];
  /** Gift reasons */
  public giftReasons: string[] = [
    GiftReason.LostSave,
    GiftReason.AuctionHouse,
    GiftReason.CommunityGift,
    GiftReason.GameError,
    GiftReason.SaveRollback,
  ];

  /** Send form gift */
  public formControls = {
    localizedTitleMessageInfo: new FormControl({}, [Validators.required]),
    localizedBodyMessageInfo: new FormControl({}, [Validators.required]),
    giftReason: new FormControl('', [Validators.required]),
    expireDate: new FormControl(null, [DateValidators.isAfter(DateTime.local().startOf('day'))]),
    hasExpirationDate: new FormControl(false),
  };
  public sendGiftForm = new FormGroup(this.formControls);

  /** Font awesome icons */
  public trashIcon = faTrashAlt;
  public pencilIcon = faPencilAlt;
  public approveIcon = faCheck;
  public closeIcon = faTimes;

  /** Game settings ID  */
  public selectedGameSettingsId: string;
  /** If master inventory is based on game settings ids. */
  public hasGameSettings: boolean = false;
  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  public activePermAttribute = PermAttributeName.GiftPlayer;

  /**
   * Item groups used to populate item selection dropdown.
   * NOTE:  Due to master inventory items being so different per title, I am leaving this
   * variable setup in the <title> gift basket.
   */
  public inventoryItemGroups: InventoryItemGroup[] = [];

  /** The localized string service. */
  public selectLocalizedStringService: SelectLocalizedStringContract;

  /** Game title */
  public abstract title: GameTitle;

  /** Sets whether the title supports expiration date on gift. */
  public abstract allowSettingExpireDate: boolean;

  /**
   * Sets whether the title supports localized title and body ids.
   * Make sure selectLocalizedStringService is correctly implemented if setting this to true.
   */
  public abstract allowSettingLocalizedMessage: boolean;

  constructor(
    private readonly backgroundJobService: BackgroundJobService,
    protected readonly store: Store,
  ) {
    super();
  }

  /** Generates a title specific gift. */
  public abstract generateGiftInventoryFromGiftBasket(): GiftUnion;

  /** Populates the gift basket from the set reference inventory. */
  public abstract populateGiftBasketFromReference(): void;

  /** Sends a gift to players. */
  public abstract sendGiftToPlayers$(gift: GiftUnion): Observable<BackgroundJob<void>>;

  /** Sends a gift to an LSP group. */
  public abstract sendGiftToLspGroup$(gift: GiftUnion): Observable<GiftResponse<BigNumber>>;

  /** Sets the state gift basket. */
  public abstract setStateGiftBasket(giftBasket: GiftBasketModel[]): void;

  /** Lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.usingPlayerIdentities) {
      this.activePermAttribute = this.usingPlayerIdentities
        ? PermAttributeName.GiftPlayer
        : PermAttributeName.GiftGroup;
    }
  }

  /** Filter for the expire date date time component */
  public dateTimeFutureFilter = (input: DateTime | null): boolean => {
    const day = input || DateTime.local().startOf('day');
    return day > DateTime.local().startOf('day');
  };

  /** On gift reason chaged */
  public giftReasonChanged(event: MatSelectChange): void {
    if (!event) {
      return;
    }

    if (!this.profile) {
      this.profile = this.store.selectSnapshot<UserModel>(UserState.profile);
    }

    this.ignoreMaxCreditLimit =
      event?.value === GiftReason.LostSave &&
      (this.profile.role === UserRole.LiveOpsAdmin ||
        this.profile.role === UserRole.SupportAgentAdmin);
    this.setStateGiftBasket(this.giftBasket.data);
  }

  /** Adds a new item to the gift basket. */
  public addItemtoBasket(item: GiftBasketModel): void {
    const tmpGiftBasket = this.giftBasket.data;

    const existingItemIndex = tmpGiftBasket.findIndex(data => {
      return (
        data.id.isEqualTo(item.id) &&
        data.itemType === item.itemType &&
        data.description === item.description
      );
    });

    if (existingItemIndex >= 0) {
      tmpGiftBasket[existingItemIndex].quantity =
        tmpGiftBasket[existingItemIndex].quantity + item.quantity;
    } else {
      tmpGiftBasket.push(item);
    }

    this.setStateGiftBasket(tmpGiftBasket);
  }

  /** Edit item quantity */
  public editItemQuantity(index: number): void {
    const newQuantityStr = (
      document.getElementById(`new-item-quantity-${index}`) as HTMLInputElement
    ).value;
    const newQuantity = parseInt(newQuantityStr);

    if (newQuantity > 0) {
      const tmpGiftBasket = this.giftBasket.data;
      tmpGiftBasket[index].quantity = newQuantity;
      tmpGiftBasket[index].edit = false;
      this.setStateGiftBasket(tmpGiftBasket);
    }
  }

  /** Removes item from gift basket at the given index. */
  public removeItemFromGiftBasket(index: number): void {
    const tmpGiftBasket = this.giftBasket.data;
    tmpGiftBasket.splice(index, 1);
    this.setStateGiftBasket(tmpGiftBasket);
  }

  /** Returns whether the gift basket is okay to send to the API. */
  public isGiftBasketReady(): boolean {
    return (
      !this.isLoading &&
      this.sendGiftForm.valid &&
      this.giftBasket?.data?.length > 0 &&
      !this.giftBasketHasErrors &&
      ((this.usingPlayerIdentities && this.playerIdentities?.length > 0) ||
        (!this.usingPlayerIdentities && !!this.lspGroup))
    );
  }

  /** Sends the gift basket. */
  public sendGiftBasket(): void {
    this.isLoading = true;
    const gift = this.generateGiftInventoryFromGiftBasket();

    const sendGift$: Observable<BackgroundJob<void> | GiftResponse<BigNumber>> = this
      .usingPlayerIdentities
      ? this.sendGiftToPlayers$(gift)
      : this.sendGiftToLspGroup$(gift);

    sendGift$
      .pipe(
        catchError(error => {
          this.loadError = error;
          this.isLoading = false;
          return EMPTY;
        }),
        take(1),
        tap(response => {
          // If response is a background job, we must wait for it to complete.
          if (!!(response as BackgroundJob<void>)?.jobId) {
            this.waitForBackgroundJobToComplete(response as BackgroundJob<void>);
            return;
          }

          this.giftResponse = [response as GiftResponse<BigNumber>];
          this.isLoading = false;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }

  /** Get the number of days between right now and the selected date */
  public getExpireDateInDays(): BigNumber {
    if (!this.formControls.hasExpirationDate.value) {
      return new BigNumber(0);
    }
    let numberOfDays = _.round(this.formControls.expireDate.value.diffNow('days').days);
    // Replace negative values by 0 to avoid sending negative values to API which takes a uint
    numberOfDays = _.max([0, numberOfDays]);
    return tryParseBigNumber(numberOfDays).integerValue();
  }

  /** Add a default expiration the first time the hasExpiration checkbox is checked */
  public initExpireDate(): void {
    if (!this.formControls.expireDate.value) {
      this.formControls.expireDate.setValue(DateTime.local().plus({ days: 7 }));
    }
  }

  /** Waits for a background job to complete. */
  public waitForBackgroundJobToComplete(job: BackgroundJob<void>): void {
    this.backgroundJobService
      .getBackgroundJob$<GiftResponse<BigNumber | string>[]>(job.jobId)
      .pipe(
        catchError(_error => {
          this.loadError = _error;
          this.isLoading = false;
          return EMPTY;
        }),
        take(1),
        tap(job => {
          switch (job.status) {
            case BackgroundJobStatus.Completed:
            case BackgroundJobStatus.CompletedWithErrors:
              this.giftResponse = Array.isArray(job.result) ? job.result : [job.result];
              break;
            case BackgroundJobStatus.InProgress:
              throw 'still in progress';
            default:
              this.loadError = job.result || 'Background job failed unexpectedly.';
          }
          this.isLoading = false;
        }),
        retryWhen(errors$ => errors$.pipe(delayWhen(() => timer(3_000)))),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }

  /** Clears the gift basket state by reinitializing component variables. */
  public resetGiftBasketUI(clearItemsInBasket: boolean = false): void {
    this.giftResponse = undefined;
    this.loadError = undefined;
    this.isLoading = false;

    if (clearItemsInBasket) {
      this.sendGiftForm.reset();
      this.sendGiftForm.controls.localizedTitleMessageInfo.reset({});
      this.sendGiftForm.controls.localizedBodyMessageInfo.reset({});
      this.setStateGiftBasket([]);
      this.giftBasketHasErrors = false;
    }
  }
}
