import { Component, OnInit } from '@angular/core';
import { GameTitle } from '@models/enums';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import {
  BountyDetail,
  SteelheadBountiesService,
} from '@services/api-v2/steelhead/bounties/steelhead-bounties.service';
import { ActivatedRoute } from '@angular/router';
import { ParsePathParamFunctions, PathParams } from '@models/path-params';
import { getLeaderboardRoute, getUserGroupManagementRoute } from '@helpers/route-links';
import { environment } from '@environments/environment';

/** Retreives and displays Steelhead bounty details. */
@Component({
  selector: 'steelhead-bounty-details',
  templateUrl: './steelhead-bounty-details.component.html',
  styleUrls: ['./steelhead-bounty-details.component.scss'],
})
export class SteelheadBountyDetailsComponent extends BaseComponent implements OnInit {
  public gameTitle = GameTitle.FM8;

  public getMonitor = new ActionMonitor('GET Bounty Details');
  public bountyId: string;
  public bountyDetails: BountyDetail;
  public userGroupLink = getUserGroupManagementRoute(this.gameTitle);
  public leaderboardLink = getLeaderboardRoute(this.gameTitle);
  public leaderboardLinkQueryParams;

  constructor(
    private readonly steelheadBountiesService: SteelheadBountiesService,
    private readonly route: ActivatedRoute,
  ) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.route.params
      .pipe(
        tap(() => {
          this.bountyId = null;
          this.bountyDetails = null;
        }),
        map(() => ParsePathParamFunctions[PathParams.BountyId](this.route)),
        filter(bountyId => !!bountyId),
        switchMap(bountyId => {
          this.bountyId = bountyId;
          this.getMonitor = this.getMonitor.repeat();
          return this.steelheadBountiesService
            .getBountyDetail$(bountyId)
            .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$));
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(bountyDetails => {
        this.bountyDetails = bountyDetails;
        this.leaderboardLinkQueryParams = {
          scoreboardTypeId: '3',
          scoreTypeId: bountyDetails.rivalsEvent.scoreType,
          gameScoreboardId: bountyDetails.rivalsEvent.id,
          trackId: bountyDetails.trackId,
          leaderboardEnvironment: environment.production ? 'Prod' : 'Dev',
          ps: '25',
        };
      });
  }
}
