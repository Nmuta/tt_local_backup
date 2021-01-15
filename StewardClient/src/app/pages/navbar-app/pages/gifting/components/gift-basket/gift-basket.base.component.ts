import { Component, Input } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { GameTitleCodeName } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';

type IdentityResultUnion = IdentityResultAlpha | IdentityResultBeta;
type MasterInventoryUnion = GravityMasterInventory | SunriseMasterInventory;

/** The base gift-basket component. */
@Component({
  template: '',
})
export abstract class GiftBasketBaseComponent<T extends IdentityResultUnion> extends BaseComponent {
  @Input() public playerIdentities: T[];
  @Input() public lspGroup: LspGroup;

  /** Master inventory list. */
  public masterInventory: MasterInventoryUnion;
  /** If gift basket is disabled. TODO: Remove once component is built out */
  public disableCard: boolean = false;

  /** If master inventory is based on game settings ids. */
  public hasGameSettings: boolean = false;
  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  /** Game title */
  public abstract title: GameTitleCodeName;
}
