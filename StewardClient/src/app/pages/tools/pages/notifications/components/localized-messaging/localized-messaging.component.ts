import { Component, Input } from '@angular/core';
import { CommunityMessageResult, LocalizedMessage } from '@models/community-message';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { JsonTableResult } from '@models/json-table-result';
import { sortBy } from 'lodash';
import BigNumber from 'bignumber.js';
import { GiftIdentityAntecedent } from '@shared/constants';
import { GameTitle } from '@models/enums';
import { SelectLocalizedStringContract } from '@components/localization/select-localized-string/select-localized-string.component';

/** Service contract for UGC search filters. */
export interface LocalizedMessagingContract {
  gameTitle: GameTitle;
  lockStartTime: boolean;

  // Methods to send out localized messages
  sendLocalizedMessage$(
    xuids: BigNumber[],
    localizedMessage: LocalizedMessage,
  ): Observable<CommunityMessageResult<BigNumber>[]>;
  sendLspLocalizedMessage$(
    lspGroupId: BigNumber,
    localizedMessage: LocalizedMessage,
  ): Observable<CommunityMessageResult<BigNumber>>;
  selectLocalizedStringContract: SelectLocalizedStringContract;
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
  @Input() service: LocalizedMessagingContract;
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

  /** New community message created. */
  public setNewLocalizedMessage($event: LocalizedMessage): void {
    //console.log('localized-messaging::setNewLocalizedMessage')
    //console.log($event)
    this.newLocalizedMessage = $event;
    this.waitingForVerification = true;
  }

  /** Submit community message */
  public submitLocalizedMessage(): void {
    this.isLoading = true;

    let submitLocalizedMessage$: Observable<CommunityMessageResult<BigNumber>[]>;
    if (this.isUsingPlayerIdentities) {
      submitLocalizedMessage$ = this.service?.sendLocalizedMessage$(
        this.playerIdentities.map(identity => identity.xuid),
        this.newLocalizedMessage,
      );
    } else {
      submitLocalizedMessage$ = this.service
        ?.sendLspLocalizedMessage$(this.selectedLspGroup.id, this.newLocalizedMessage)
        .pipe(switchMap(data => of([data])));
    }

    submitLocalizedMessage$
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
