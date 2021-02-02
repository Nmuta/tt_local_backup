import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityResultUnion } from '@models/identity-query.model';
import { GameTitleCodeName } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTrashAlt, faPencilAlt, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { MasterInventoryItem } from '@models/master-inventory-item';

export type MasterInventoryUnion = GravityMasterInventory | SunriseMasterInventory;
export type InventoryItemGroup = {
  category: string;
  items: MasterInventoryItem[];
};

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
  /** If gift basket is disabled. TODO: Remove once component is built out */
  public disableCard: boolean = false;
  /** The gift basket of current items to be send. */
  public giftBasket = new MatTableDataSource<GiftBasketModel>();
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

  constructor(protected readonly formBuilder: FormBuilder) {
    super();
  }

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

  /** Clears the gift basket. */
  public clearGiftBasket(): void {
    this.giftBasket.data = [];
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

  /** Sends the gift basket */
  public sendGiftBasket(): void {
    // TODO: Send request to Steward API and emit results back up to parent gifting page component
  }

  /** Returns whether the gift basket is okay to send to the API. */
  public isGiftBasketReady(): boolean {
    // TODO: When we introduce item errors, add the errors check here
    // Examples: quantity too high for specific item, game settings changed with existing items in basket that are no longer valid
    return (
      this.sendGiftForm.valid &&
      this.giftBasket?.data?.length > 0 &&
      ((this.usingPlayerIdentities && this.playerIdentities?.length > 0) ||
        (!this.usingPlayerIdentities && !!this.lspGroup))
    );
  }
}
