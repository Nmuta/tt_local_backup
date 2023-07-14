import { Component, Input } from '@angular/core';
import { CommunityMessage, CommunityMessageResult } from '@models/community-message';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { JsonTableResult } from '@models/json-table-result';
import { sortBy } from 'lodash';
import BigNumber from 'bignumber.js';
import { GiftIdentityAntecedent } from '@shared/constants';
import { GameTitle } from '@models/enums';

/** Routed Component; Sunrise Community Messaging Tool. */
type MessageSendResultViewable = {
  identity: BigNumber;
  identityAntecedent: GiftIdentityAntecedent;
  error: string;
};

/**
 *  Community messaging component
 */
@Component({
  template: '',
})
export abstract class CommunityMessagingComponent extends BaseComponent {
  /** REVIEW-COMMENT: Player identities. Default to empty array. */
  @Input() playerIdentities: IdentityResultAlpha[] = [];
  /** REVIEW-COMMENT: Selected Lsp Group. */
  @Input() selectedLspGroup: LspGroup;
  /** True if component is using player identities. */
  @Input() isUsingPlayerIdentities: boolean = true;

  /** True while waiting for community message verification. */
  public waitingForVerification: boolean = false;
  /** The pending community message. */
  public newCommunityMessage: CommunityMessage;
  /** The community message results. */
  public sentCommunityMessageResults: JsonTableResult<MessageSendResultViewable>[] = [];

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  public abstract gameTitle: GameTitle;
  public abstract lockStartTime: boolean;
  public abstract submitCommunityMessage$(): Observable<CommunityMessageResult<BigNumber>[]>;

  /** New community message created. */
  public setNewCommunityMessage($event: CommunityMessage): void {
    this.newCommunityMessage = $event;
    this.waitingForVerification = true;
  }

  /** Submit community message */
  public submitCommunityMessage(): void {
    this.isLoading = true;

    const submitCommunityMessage$ = this.submitCommunityMessage$();
    submitCommunityMessage$
      .pipe(
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return EMPTY;
        }),
        map(data =>
          sortBy(data, item => {
            return item.error;
          }),
        ),
        takeUntil(this.onDestroy$),
      )
      .subscribe(data => {
        this.isLoading = false;

        this.sentCommunityMessageResults = data.map(item => {
          return {
            showErrorInTable: !!item.error,
            identity: item.playerOrLspGroup,
            identityAntecedent: item.identityAntecedent,
            error: item.error?.message,
          } as JsonTableResult<MessageSendResultViewable>;
        });
      });
  }

  /** Clears the message UI */
  public clearMessageUI(): void {
    this.sentCommunityMessageResults = [];
    this.waitingForVerification = false;
    this.newCommunityMessage = undefined;
    this.loadError = undefined;
  }

  /** Checks if community message is ready to send. */
  public isCommunityMessageReady(): boolean {
    return (
      !!this.newCommunityMessage &&
      (this.isUsingPlayerIdentities ? this.playerIdentities?.length > 0 : !!this.selectedLspGroup)
    );
  }
}
