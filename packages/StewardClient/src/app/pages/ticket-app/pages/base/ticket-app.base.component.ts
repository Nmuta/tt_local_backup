import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitleCodeName } from '@models/enums';
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
export abstract class TicketAppBaseComponent<TPlayerIdentity extends IdentityResultUnion>
  extends BaseComponent
  implements OnInit
{
  public lookupGamertag: string;

  public gameTitle: GameTitleCodeName;
  public playerIdentity: TPlayerIdentity;

  constructor(private readonly ticketService: TicketService, private readonly store: Store) {
    super();
  }

  public abstract isInCorrectTitleRoute(gameTitle: GameTitleCodeName): boolean;

  public abstract requestPlayerIdentity$(gamertag: string): Observable<IdentityResultUnion>;

  /** Logic for the OnInit component lifecycle. */
  public ngOnInit(): void {
    this.ticketService
      .getForzaTitle$()
      .pipe(
        take(1),
        tap(title => {
          this.gameTitle = title;
          if (!this.isInCorrectTitleRoute(this.gameTitle)) {
            this.store.dispatch(new Navigate(['/ticket-app/title/'], null, { replaceUrl: true }));
          }
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();

    this.ticketService
      .getTicketRequestorGamertag$()
      .pipe(
        switchMap(gamertag => {
          this.lookupGamertag = gamertag;
          return this.requestPlayerIdentity$(this.lookupGamertag);
        }),
        take(1),
        tap(identity => {
          this.playerIdentity = identity as TPlayerIdentity;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
  }
}
