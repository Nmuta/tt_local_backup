import { Component } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';

type IdentityResultUnion = IdentityResultAlpha | IdentityResultBeta;

/** The sunrise gifting page for the Navbar app. */
@Component({
  template: '',
})
export abstract class GiftingBaseComponent<T extends IdentityResultUnion> extends BaseComponent {
  public title: GameTitleCodeName = GameTitleCodeName.FH4;
  public matTabSelectedIndex: number = 0;
  public selectedPlayerIdentities: T[];
  public selectedLspGroup: LspGroup;

  public disableLspGroupSelection: boolean = true;

  /** Tracks when the mat tab is changed  */
  public abstract matTabSelectionChange(index: number): void;

  /** Logic when player selection outputs identities. */
  public abstract onPlayerIdentitiesChange(event: T[]): void;

  /** Player identity selected */
  public abstract playerIdentitySelected(identity: T): void;

  /** Logic when lspgroup selection outputs new value. */
  public abstract onLspGroupChange(event: LspGroup): void;
}
