import { Component } from '@angular/core';
import { CommunityMessage, CommunityMessageResult } from '@models/community-message';
import { NEVER, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@components/base-component/base-component.component';
import { SunriseService } from '@services/sunrise';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { JsonTableResult } from '@models/json-table-result';
import { sortBy } from 'lodash';
import BigNumber from 'bignumber.js';

/** Routed Component; Sunrise Community Messaging Tool. */
@Component({
  templateUrl: './sunrise-community-messaging.component.html',
  styleUrls: ['./sunrise-community-messaging.component.scss'],
})
export class SunriseCommunityMessagingComponent extends BaseComponent {
  /** The selected player identities */
  public playerIdentities: IdentityResultAlpha[] = [];
  /** The selected LSP Group ID. */
  public selectedLspGroup: LspGroup;
  /** True when player identities are being used. */
  public isUsingPlayerIdentities: boolean = true;
  /** True while waiting for community message verification. */
  public waitingForVerification: boolean = false;
  /** The pending community message. */
  public newCommunityMessage: CommunityMessage;
  /** The community message results */
  public sentCommunityMessageResults: JsonTableResult<CommunityMessageResult<BigNumber>>[] = [];

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  constructor(private readonly sunriseService: SunriseService) {
    super();
  }

  /** New community message created. */
  public setNewCommunityMessage($event: CommunityMessage): void {
    this.newCommunityMessage = $event;
    this.waitingForVerification = true;
  }

  /** Submit community message */
  public submitCommunityMessage(): void {
    this.isLoading = true;

    const submitCommunityMessage$: Observable<CommunityMessageResult<BigNumber>[]> = this
      .isUsingPlayerIdentities
      ? this.sunriseService.postSendCommunityMessageToXuids(
          this.playerIdentities.map(identity => identity.xuid),
          this.newCommunityMessage,
        )
      : this.sunriseService
          .postSendCommunityMessageToLspGroup(this.selectedLspGroup.id, this.newCommunityMessage)
          .pipe(switchMap(data => of([data])));

    submitCommunityMessage$
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          return NEVER;
        }),
        map(data =>
          sortBy(data, item => {
            return !item.success;
          }),
        ),
      )
      .subscribe(data => {
        this.isLoading = false;
        const sortedData = sortBy(data, item => {
          return item.success;
        });

        this.sentCommunityMessageResults = sortedData.map(item => {
          const tableResult = item as JsonTableResult<CommunityMessageResult<BigNumber>>;
          tableResult.showErrorInTable = !item.success;
          return tableResult;
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

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasSunrise).map(i => i.sunrise);
    this.playerIdentities = newIdentities;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSunrise) {
      return 'Player does not have a sunrise account. Player will be ignored.';
    }

    return null;
  }

  /** Sets if tool is using player identities as selection type; */
  public playerSelectionTypeChange($event: number): void {
    this.isUsingPlayerIdentities = $event === 0;
  }
}
