import { Component, Input } from '@angular/core';
import { CommunityMessageResult, LocalizedMessage } from '@models/community-message';
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

/** Service contract for UGC search filters. */
export interface LocalizedMessagingContract {
  gameTitle: GameTitle;
  lockStartTime: boolean;
  //getLocalizedMessages$():;
  sendLocalizedMessage$(xuids: BigNumber[], localizedMessage: LocalizedMessage): Observable<CommunityMessageResult<BigNumber>[]>;
}

/** Routed Component; Sunrise Community Messaging Tool. */
type MessageSendResultViewable = {
  identity: BigNumber;
  identityAntecedent: GiftIdentityAntecedent;
  error: string;
};

/**
 *  Localized messaging component
 */
 @Component({
  selector: 'localized-messaging',
  templateUrl: './localized-messaging.component.html',
  styleUrls: ['./localized-messaging.component.scss'],
})
export class LocalizedMessagingComponent extends BaseComponent {
  @Input() service: LocalizedMessagingServiceContract;
  @Input() playerIdentities: IdentityResultAlpha[] = [];
  @Input() selectedLspGroup: LspGroup;
  @Input() isUsingPlayerIdentities: boolean = true;

  /** True while waiting for community message verification. */
  public waitingForVerification: boolean = false;
  /** The pending community message. */
  public newLocalizedMessage: LocalizedMessage;
  /** The community message results */
  public sentCommunityMessageResults: JsonTableResult<MessageSendResultViewable>[] = [];

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  //public abstract gameTitle: GameTitle;
  //public abstract lockStartTime: boolean;
  //public abstract submitLocalizedMessage$(): Observable<CommunityMessageResult<BigNumber>[]>;

  /** New community message created. */
  public setNewLocalizedMessage($event: LocalizedMessage): void {
    this.newLocalizedMessage = $event;
    this.waitingForVerification = true;
  }

  /** Submit community message */
  public submitLocalizedMessage(): void {
    this.isLoading = true;

    const submitCommunityMessage$ = this.service?.sendLocalizedMessage$();
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
    this.newLocalizedMessage = undefined;
    this.loadError = undefined;
  }

  /** Checks if community message is ready to send. */
  public isLocalizedMessageReady(): boolean {
    return (
      !!this.newLocalizedMessage &&
      (this.isUsingPlayerIdentities ? this.playerIdentities?.length > 0 : !!this.selectedLspGroup)
    );
  }
}
