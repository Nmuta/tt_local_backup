import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';

/** The sunrise gift history page for the Navbar app. */
@Component({
  template: '',
})
export abstract class GiftHistoryBaseComponent<
  T extends IdentityResultUnion
> extends BaseComponent {
  public title: GameTitleCodeName = GameTitleCodeName.FH4;
  public matTabSelectedIndex: number = 0;
  public disableLspGroupSelection: boolean = true;

  /** Logic when player selection outputs identities. */
  public abstract onPlayerIdentitiesChange(event: T[]): void;

  /** Player identity selected */
  public abstract playerIdentitySelected(identity: T): void;
}
