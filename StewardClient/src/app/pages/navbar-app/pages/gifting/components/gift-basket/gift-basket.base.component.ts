import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityResultUnion } from '@models/identity-query.model';
import { GameTitleCodeName } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt, faPencilAlt, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { MasterInventoryItem, MasterInventoryUnion } from '@models/master-inventory-item';
import { GiftResponse } from '@models/gift-response';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { catchError, delayWhen, retryWhen, take, takeUntil, tap } from 'rxjs/operators';
import { NEVER, Observable, timer } from 'rxjs';
import { BackgroundJob, BackgroundJobStatus } from '@models/background-job';
import { GravityGift } from '@models/gravity';
import { SunriseGift } from '@models/sunrise';
import { ApolloGift } from '@models/apollo';

export type InventoryItemGroup = {
  category: string;
  items: MasterInventoryItem[];
};
export type GiftUnion = GravityGift | SunriseGift | ApolloGift;
export type GiftBasketModel = MasterInventoryItem & { edit: boolean };

/** The base gift-basket component. */
@Component({
  template: '',
})
export abstract class GiftBasketBaseComponent<T extends IdentityResultUnion> extends BaseComponent {
  @Input() public playerIdentities: T[];
  @Input() public lspGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  /** Master inventory list. */
  public masterInventory: MasterInventoryUnion;
  /** The gift basket of current items to be send. */
  public giftBasket = new MatTableDataSource<GiftBasketModel>();
  /** Gifting response. */
  public giftResponse: GiftResponse<bigint | string>[];
  /** The gift basket display columns */
  public displayedColumns: string[] = ['itemId', 'description', 'itemType', 'quantity', 'remove'];
  /** Gift reasons */
  public giftReasons: string[] = [
    'Lost Save',
    'Auction House',
    'Community Gift',
    'Game Error',
    'Save Rollback',
  ];
  /** Send form gift */
  public sendGiftForm: FormGroup = this.formBuilder.group({
    giftReason: ['', Validators.required],
  });

  /** Font awesome icons */
  public trashIcon = faTrashAlt;
  public pencilIcon = faPencilAlt;
  public approveIcon = faCheck;
  public closeIcon = faTimes;

  /** If master inventory is based on game settings ids. */
  public hasGameSettings: boolean = false;
  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  /**
   * Item groups used to populate item selection dropdown.
   * NOTE:  Due to master inventory items being so different per title, I am leaving this
   * variable setup in the <title> gift basket.
   */
  public inventoryItemGroups: InventoryItemGroup[] = [];

  /** Game title */
  public abstract title: GameTitleCodeName;

  constructor(
    protected readonly backgroundJobService: BackgroundJobService,
    protected readonly formBuilder: FormBuilder,
  ) {
    super();
  }

  /** Generates a title specific gift. */
  public abstract generateGiftInventoryFromGiftBasket(): GiftUnion;

  /** Sends a gift to players. */
  public abstract sendGiftToPlayers(gift: GiftUnion): Observable<BackgroundJob<void>>;

  /** Sends a gift to an LSP group. */
  public abstract sendGiftToLspGroup(gift: GiftUnion): Observable<GiftResponse<bigint>>;

  /** Adds a new item to the gift basket. */
  public addItemtoBasket(item: GiftBasketModel): void {
    const temporaryGiftBasket = this.giftBasket.data;

    const existingItemIndex = temporaryGiftBasket.findIndex(data => {
      return data.id === item.id && data.itemType === item.itemType;
    });

    if (existingItemIndex >= 0) {
      this.giftBasket.data[existingItemIndex].quantity =
        this.giftBasket.data[existingItemIndex].quantity + item.quantity;
      return;
    }

    temporaryGiftBasket.push(item);
    temporaryGiftBasket.sort((a: GiftBasketModel, b: GiftBasketModel) => {
      return a.itemType.localeCompare(b.itemType) || a.description.localeCompare(b.description);
    });

    this.giftBasket.data = temporaryGiftBasket;
  }

  /** Edit item quantity */
  public editItemQuantity(index: number): void {
    const newQuantityStr = (document.getElementById(
      `new-item-quantity-${index}`,
    ) as HTMLInputElement).value;
    const newQuantity = parseInt(newQuantityStr);

    if (newQuantity > 0) {
      this.giftBasket.data[index].quantity = newQuantity;
      this.giftBasket.data[index].edit = false;
    }
  }

  /** Removes item from gift basket at the given index. */
  public removeItemFromGiftBasket(index: number): void {
    const tmpGiftBasket = this.giftBasket.data;
    tmpGiftBasket.splice(index, 1);
    this.giftBasket.data = tmpGiftBasket;
  }

  /** Returns whether the gift basket is okay to send to the API. */
  public isGiftBasketReady(): boolean {
    // TODO: When we introduce item errors, add the errors check here
    // Examples: quantity too high for specific item, game settings changed with existing items in basket that are no longer valid
    return (
      !this.isLoading &&
      this.sendGiftForm.valid &&
      this.giftBasket?.data?.length > 0 &&
      ((this.usingPlayerIdentities && this.playerIdentities?.length > 0) ||
        (!this.usingPlayerIdentities && !!this.lspGroup))
    );
  }

  /** Sends the gift basket. */
  public sendGiftBasket(): void {
    this.isLoading = true;
    const gift = this.generateGiftInventoryFromGiftBasket();

    const sendGift$: Observable<BackgroundJob<void> | GiftResponse<bigint>> = this
      .usingPlayerIdentities
      ? this.sendGiftToPlayers(gift)
      : this.sendGiftToLspGroup(gift);

    sendGift$
      .pipe(
        takeUntil(this.onDestroy$),
        catchError(error => {
          this.loadError = error;
          this.isLoading = false;
          return NEVER;
        }),
        take(1),
        tap(response => {
          console.log(response);
          // If response is a background job, we must wait for it to complete.
          if (!!(response as BackgroundJob<void>)?.jobId) {
            this.waitForBackgroundJobToComplete(response as BackgroundJob<void>);
            return;
          }

          this.giftResponse = [response as GiftResponse<bigint>];
          this.isLoading = false;
        }),
      )
      .subscribe();
  }

  /** Waits for a background job to complete. */
  public waitForBackgroundJobToComplete(job: BackgroundJob<void>): void {
    this.backgroundJobService
      .getBackgroundJob<GiftResponse<bigint | string>[]>(job.jobId)
      .pipe(
        takeUntil(this.onDestroy$),
        catchError(_error => {
          this.loadError = _error;
          this.isLoading = false;
          return NEVER;
        }),
        take(1),
        tap(job => {
          switch (job.status) {
            case BackgroundJobStatus.Completed:
              this.giftResponse = job.parsedResult;
              break;
            case BackgroundJobStatus.InProgress:
              throw 'still in progress';
            default:
              this.loadError = job.result;
          }
          this.isLoading = false;
        }),
        retryWhen(errors => errors.pipe(delayWhen(() => timer(3_000)))),
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
      this.giftBasket.data = [];
    }
  }
}
