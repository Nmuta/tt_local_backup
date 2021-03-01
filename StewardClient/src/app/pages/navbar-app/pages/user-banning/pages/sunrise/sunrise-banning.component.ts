import { Component, ViewChildren } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseBanArea, SunriseBanRequest, SunriseBanSummary } from '@models/sunrise';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { SunriseService } from '@services/sunrise';
import { SunriseBanHistoryComponent } from '@shared/views/ban-history/titles/sunrise/sunrise-ban-history.component';
import { Dictionary, filter, keyBy } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BanOptions } from '../../components/ban-options/ban-options.component';

/** Routed Component; Sunrise Banning Tool. */
@Component({
  templateUrl: './sunrise-banning.component.html',
  styleUrls: ['./sunrise-banning.component.scss'],
})
export class SunriseBanningComponent {
  @ViewChildren('sunrise-ban-history')
  public banHistoryComponents: SunriseBanHistoryComponent[] = [];

  public playerIdentities$ = new Subject<IdentityResultAlpha[]>();
  public playerIdentities: IdentityResultAlpha[] = [];
  public selectedPlayerIdentity: AugmentedCompositeIdentity = null;

  public formControls = {
    banOptions: new FormControl('', [Validators.required]),
  };

  public formGroup = new FormGroup({
    banOptions: this.formControls.banOptions,
  });

  public summaryLookup: Dictionary<SunriseBanSummary> = {};
  public bannedXuids: bigint[] = [];
  public selectedPlayer: IdentityResultAlpha = null;

  constructor(private readonly sunrise: SunriseService) {
    const summaries = new Subject<SunriseBanSummary[]>();
    this.playerIdentities$
      .pipe(
        map(identities => identities.map(i => i.xuid)), // to xuid list
        switchMap(xuids => this.sunrise.getBanSummariesByXuids(xuids)), // make request
      )
      .subscribe(summaries);
    summaries
      .pipe(map(summaries => keyBy(summaries, e => e.xuid) as Dictionary<SunriseBanSummary>))
      .subscribe(summaryLookup => (this.summaryLookup = summaryLookup));
    summaries
      .pipe(
        map(summaries => filter(summaries, summary => summary.banCount > BigInt(0))), // only banned identities
        map(summaries => summaries.map(summary => summary.xuid)), // map to xuids
      )
      .subscribe(bannedXuids => (this.bannedXuids = bannedXuids));
  }

  public submit = (): Observable<unknown> => this.submitInternal();

  /** Submit the form. */
  public submitInternal(): Observable<unknown> {
    const identities = this.playerIdentities;
    const banOptions = this.formControls.banOptions.value as BanOptions;
    const bans: SunriseBanRequest[] = identities.map(identity => {
      return <SunriseBanRequest>{
        xuid: identity.xuid,
        banAllConsoles: banOptions.checkboxes.banAllXboxes,
        banAllPcs: banOptions.checkboxes.banAllPCs,
        deleteLeaderboardEntries: banOptions.checkboxes.deleteLeaderboardEntries,
        sendReasonNotification: true,
        reason: banOptions.banReason,
        featureArea: (banOptions.banArea as unknown) as SunriseBanArea,
        duration: banOptions.banDuration,
      };
    });

    return this.sunrise.postBanPlayers(bans);
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasSunrise).map(i => i.sunrise);
    this.playerIdentities = newIdentities;
    this.playerIdentities$.next(this.playerIdentities);
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayer = identity?.extra?.hasSunrise ? identity.sunrise : null;
  }
}
