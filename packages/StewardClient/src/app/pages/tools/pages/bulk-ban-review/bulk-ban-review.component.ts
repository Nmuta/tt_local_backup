import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent } from '@components/base-component/base.component';
import { ApolloBanSummary } from '@models/apollo';
import { SunriseBanSummary } from '@models/sunrise';
import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, map as rxjsMap, mergeAll, takeUntil, toArray } from 'rxjs/operators';
import BigNumber from 'bignumber.js';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { GameTitleCodeName } from '@models/enums';
import { chunk, clone, flatten, orderBy } from 'lodash';
import { SunriseService } from '@services/sunrise';
import { ApolloService } from '@services/apollo';
import { BulkBanReviewInput } from './components/bulk-ban-review-input.component';
import { ActivatedRoute } from '@angular/router';
import { getToolsActivatedRoute } from '@helpers/tools-activated-route';
import { WoodstockService } from '@services/woodstock';
import { WoodstockBanSummary } from '@models/woodstock';
import { NavbarTool } from '@environments/environment';

export type ErrorBanSummary = {
  xuid: BigNumber;
  gamertag: string;
  banCount: BigNumber;
  userExists: boolean;
  error: unknown;
};
export type BanSummariesUnion =
  | SunriseBanSummary
  | ApolloBanSummary
  | WoodstockBanSummary
  | ErrorBanSummary;
export type BanSummaryPlusEnvironment = BanSummariesUnion & {
  title: GameTitleCodeName;
  environment: string;
  userDetailsRouterLink: string[];
};

export type BanSummariesTableData = {
  xuid: BigNumber;
  gamertag: string;
  summaries: BanSummaryPlusEnvironment[];

  // Top-level properties to filter/sort by
  approved: boolean;
  totalBans: BigNumber;
};

/** The bulk ban history component. */
@Component({
  templateUrl: './bulk-ban-review.component.html',
  styleUrls: ['./bulk-ban-review.component.scss'],
})
export class BulkBanReviewComponent extends BaseComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public readonly XUID_LOOKUP_BATCH_SIZE = 500;
  public readonly XUID_LOOKUP_MAX_CONCURRENCY = 5;

  public banHistoryList = new MatTableDataSource<BanSummariesTableData>();
  public getBanSummaries = new ActionMonitor('Get ban summaries');
  public removedPlayers: BanSummariesTableData[] = [];

  // Statistic trackers
  public totalEnvironmentsSearched: number;
  public playersInReview: number; // Initializes with # of players that have bans

  public csvHeader: string[] = ['Xuid', 'Gamertag', 'Total Bans', 'Approved'];
  public currentUserListCsvData: string[][] = [];
  public approvedUserListCsvData: string[][] = [];
  public removedUserListCsvData: string[][] = [];

  public toolsRoute: ActivatedRoute;

  constructor(
    private readonly sunriseService: SunriseService,
    private readonly apolloService: ApolloService,
    private readonly woodstockService: WoodstockService,
    private readonly route: ActivatedRoute,
  ) {
    super();
  }

  /** Lifecycle hook */
  public ngAfterViewInit(): void {
    this.banHistoryList.paginator = this.paginator;
    this.toolsRoute = getToolsActivatedRoute(this.route);
  }

  /** Looks up XUIDs ban history. */
  public lookupXuids(input: BulkBanReviewInput): void {
    if (!input) {
      return;
    }

    // Build all the observables for each title/environment lookup
    const queries: Observable<BanSummaryPlusEnvironment[]>[] = [
      ...input.woodstockEnvironments.map(env => {
        return this.lookupBanHistory(GameTitleCodeName.FH5, env as never, clone(input.xuids));
      }),
      ...input.sunriseEnvironments.map(env => {
        return this.lookupBanHistory(GameTitleCodeName.FH4, env as never, clone(input.xuids));
      }),
      ...input.apolloEnvironments.map(env => {
        return this.lookupBanHistory(GameTitleCodeName.FM7, env as never, clone(input.xuids));
      }),
    ];

    this.totalEnvironmentsSearched = queries.length;
    this.getBanSummaries = this.getBanSummaries.repeat();
    combineLatest(queries)
      .pipe(this.getBanSummaries.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe((banSummaries: BanSummaryPlusEnvironment[][]) => {
        this.banHistoryList.data = this.buildPlayerBanData(input.xuids, banSummaries);
        this.buildCsvDownloadData();
        this.sortNonApprovedPlayers();
        this.calculateStatistics();
        this.banHistoryList.paginator = this.paginator;
      });
  }

  /** Calculates the summary statistics. */
  public calculateStatistics(): void {
    this.playersInReview = this.banHistoryList.data.filter(x => !x.approved).length;
  }

  /** Removes index from the player list. */
  public removePlayer(index: number): void {
    const playerList = this.banHistoryList.data;
    const removedPlayer = playerList.splice(index, 1);
    this.removedPlayers.push(...removedPlayer);
    this.banHistoryList.data = playerList;
    this.calculateStatistics();
    this.buildCsvDownloadData();
  }

  /** Approves index from the player list. */
  public approvePlayer(index: number): void {
    const playerList = this.banHistoryList.data;
    playerList[index].approved = true;
    this.banHistoryList.data = playerList;
    this.calculateStatistics();
    this.sortNonApprovedPlayers();
    this.buildCsvDownloadData();
  }

  /** Calculates the summary statistics. */
  public sortNonApprovedPlayers(): void {
    let playerList = this.banHistoryList.data;
    playerList = orderBy(
      playerList,
      [player => player.approved, player => player.totalBans.toNumber()],
      ['asc', 'desc'],
    );
    this.banHistoryList.data = playerList;
  }

  /** Resets the component UI. */
  public reset(): void {
    this.banHistoryList.data = [];
  }

  /** Builds the CSV download data, should be called everytime a player in the list is removed or approved. */
  public buildCsvDownloadData(): void {
    this.currentUserListCsvData = [this.csvHeader];
    this.approvedUserListCsvData = [this.csvHeader];
    this.removedUserListCsvData = [this.csvHeader];

    this.currentUserListCsvData.push(
      ...this.banHistoryList.data.map(player => {
        return [
          player.xuid.toString(),
          player.gamertag,
          player.totalBans.toString(),
          player.approved.toString(),
        ];
      }),
    );

    const approvedList = this.banHistoryList.data.filter(player => player.approved);
    this.approvedUserListCsvData.push(
      ...approvedList.map(player => {
        return [
          player.xuid.toString(),
          player.gamertag,
          player.totalBans.toString(),
          player.approved.toString(),
        ];
      }),
    );

    this.removedUserListCsvData.push(
      ...this.removedPlayers.map(player => {
        return [
          player.xuid.toString(),
          player.gamertag,
          player.totalBans.toString(),
          player.approved.toString(),
        ];
      }),
    );
  }

  /** Converges all ban history summaries into single array of data per xuid. */
  private buildPlayerBanData(
    xuids: BigNumber[],
    banSummaries: BanSummaryPlusEnvironment[][],
  ): BanSummariesTableData[] {
    const playerBanData = xuids.map(xuid => {
      return { xuid: xuid, summaries: [] } as BanSummariesTableData;
    });

    // Generate each list of ban summaries based on player xuid.
    for (let i = 0; i < playerBanData.length; i++) {
      const xuid = playerBanData[i].xuid;
      let totalBans = new BigNumber(0);

      // Add each environment's ban summary to player data summaries array.
      for (let z = 0; z < banSummaries.length; z++) {
        const banSummary = banSummaries[z].find(summary => summary?.xuid?.isEqualTo(xuid));

        if (!!banSummary) {
          playerBanData[i].gamertag = playerBanData[i].gamertag || banSummary.gamertag;
          totalBans = totalBans.plus(banSummary?.banCount);
          playerBanData[i].summaries.push(banSummary);
        }
      }

      // Calculate top level properties for filtering/ sorting
      const noEnvironmentsFound = !playerBanData[i].summaries.find(summary => summary?.userExists);
      const failedLookupFound = !!playerBanData[i].summaries.find(
        summary => !!(summary as ErrorBanSummary)?.error,
      );
      playerBanData[i].totalBans = totalBans;
      playerBanData[i].approved =
        totalBans.isLessThanOrEqualTo(0) && !noEnvironmentsFound && !failedLookupFound; // Auto-approve players with no bans and exist on at least one environment

      playerBanData[i].summaries = orderBy(
        playerBanData[i].summaries,
        [summary => summary?.banCount.toNumber(), summary => summary.userExists],
        ['desc', 'asc'],
      );
    }

    return playerBanData;
  }

  private lookupBanHistory(
    title: GameTitleCodeName,
    environment: string,
    xuids: BigNumber[],
  ): Observable<BanSummaryPlusEnvironment[]> {
    const batchedQueries: Observable<BanSummariesUnion[]>[] = [];

    // Generate batches of ban summary queries to not overload the LSP
    chunk(xuids, this.XUID_LOOKUP_BATCH_SIZE).forEach(batch => {
      const query = this.generateBanHistoryLookup$(title, environment, batch).pipe(
        catchError(error => {
          return of(
            // We DO NOT want to return an error.
            // The error must be connected to a player xuid so it
            // can be attached the player's list of environment summaries.
            batch.map(xuid => {
              return {
                xuid: xuid,
                userExists: false,
                banCount: new BigNumber(0),
                error: error,
              } as ErrorBanSummary;
            }),
          );
        }),
        takeUntil(this.onDestroy$),
      );

      batchedQueries.push(query);
    });

    return from(batchedQueries).pipe(
      mergeAll(this.XUID_LOOKUP_MAX_CONCURRENCY), // Set max concurrency for requesting ban summaries
      toArray(), // Wait for all requests to complete
      rxjsMap((summaries: BanSummariesUnion[][]) => {
        return flatten(summaries);
      }),
      rxjsMap((summaries: BanSummariesUnion[]) =>
        // Build the required metadata into each summary
        summaries.map(summary => {
          const summaryPlusEnv = summary as BanSummaryPlusEnvironment;
          summaryPlusEnv.title = title;
          summaryPlusEnv.environment = environment;
          summaryPlusEnv.userDetailsRouterLink = [NavbarTool.UserDetails, title.toLowerCase()];
          return summaryPlusEnv;
        }),
      ),
      takeUntil(this.onDestroy$),
    );
  }

  private generateBanHistoryLookup$(
    title: GameTitleCodeName,
    environment: string,
    xuids: BigNumber[],
  ): Observable<BanSummariesUnion[]> {
    switch (title) {
      case GameTitleCodeName.FH4:
        return this.sunriseService.getBanSummariesByXuids$(xuids, environment);
      case GameTitleCodeName.FM7:
        return this.apolloService.getBanSummariesByXuids$(xuids, environment);
      case GameTitleCodeName.FH5:
        return this.woodstockService.getBanSummariesByXuids$(xuids, environment);
      default:
        throw new Error(`Unsupported game title used: ${title}`);
    }
  }
}
