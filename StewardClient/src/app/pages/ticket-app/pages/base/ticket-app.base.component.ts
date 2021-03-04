import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { GameTitleCodeName } from '@models/enums';
import { MSError } from '@models/error.model';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { TicketService } from '@shared/services/zendesk';
import { Observable } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';

export type IdentityResultUnion = IdentityResultAlpha | IdentityResultBeta;

/** Coordination component for for ticket-app. */
@Component({
  template: '',
})
export abstract class TicketAppBaseComponent extends BaseComponent implements OnInit {
  public lookupGamertag: string;
  public identityError: MSError;

  public gameTitle: GameTitleCodeName;
  public gamertag: string;
  public xuid: bigint;

  constructor(protected readonly ticketService: TicketService, protected readonly store: Store) {
    super();
  }

  public abstract isInCorrectTitleRoute(gameTitle: GameTitleCodeName): boolean;

  public abstract requestPlayerIdentity(gamertag: string): Observable<IdentityResultUnion>;

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.ticketService
      .getForzaTitle$()
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
        tap(title => {
          this.gameTitle = title;
          if (!this.isInCorrectTitleRoute(this.gameTitle)) {
            this.store.dispatch(
              new Navigate(['/support/ticket-app/title/'], null, { replaceUrl: true }),
            );
          }
        }),
      )
      .subscribe();

    this.ticketService
      .getTicketRequestorGamertag$()
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(gamertag => {
          this.lookupGamertag = gamertag;
          return this.requestPlayerIdentity(this.lookupGamertag);
        }),
        take(1),
        tap(identity => {
          this.gamertag = identity.gamertag;
          this.xuid = identity.xuid;
          this.identityError = identity.error;
        }),
      )
      .subscribe();
  }
}
