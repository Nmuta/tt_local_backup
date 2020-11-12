import { Injectable } from '@angular/core';
import { SunrisePlayerDetails, SunriseUserFlags } from '@models/sunrise';
import { SunriseBanHistory } from '@models/sunrise/sunrise-ban-history.model';
import { SunriseConsoleDetails } from '@models/sunrise/sunrise-console-details.model';
import { SunriseCreditHistory } from '@models/sunrise/sunrise-credit-history.model';
import { SunriseProfileSummary } from '@models/sunrise/sunrise-profile-summary.model';
import { SunriseSharedConsoleUsers } from '@models/sunrise/sunrise-shared-console-users.model';
import { ApiService } from '@services/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Handles calls to Sunrise API routes. */
@Injectable({
  providedIn: 'root',
})
export class SunriseService {
  public basePath: string = 'v2/title/sunrise';

  constructor(private readonly apiService: ApiService) {}

  /** Gets gravity player details with a gamertag. This can be used to retrieve a XUID. */
  public getPlayerDetailsByGamertag(gamertag: string): Observable<SunrisePlayerDetails> {
    return this.apiService.getRequest<SunrisePlayerDetails>(
      `${this.basePath}/player/gamertag(${gamertag})/details`,
    );
  }

  /** Gets user flags by a XUID. */
  public getFlagsByXuid(xuid: number): Observable<SunriseUserFlags> {
    return this.apiService.getRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
    );
  }

  /** Gets user flags by a XUID. */
  public putFlagsByXuid(xuid: number, flags: SunriseUserFlags): Observable<SunriseUserFlags> {
    return this.apiService.putRequest<SunriseUserFlags>(
      `${this.basePath}/player/xuid(${xuid})/userFlags`,
      flags,
    );
  }

  /** Gets user flags by a XUID. */
  public getBanHistoryByXuid(xuid: number): Observable<SunriseBanHistory> {
    return this.apiService
      .getRequest<SunriseBanHistory>(`${this.basePath}/player/xuid(${xuid})/banHistory`)
      .pipe(
        map(banHistory => {
          // these come in stringly-typed and must be converted

          for (const entry of banHistory.liveOpsBanHistory) {
            entry.startTimeUtc = new Date(entry.startTimeUtc);
            entry.expireTimeUtc = new Date(entry.expireTimeUtc);
          }

          for (const entry of banHistory.servicesBanHistory) {
            entry.startTimeUtc = new Date(entry.startTimeUtc);
            entry.expireTimeUtc = new Date(entry.expireTimeUtc);
          }

          return banHistory;
        }),
      );
  }

  /** Gets shared console users by XUID. */
  public getSharedConsoleUsersByXuid(xuid: number): Observable<SunriseSharedConsoleUsers> {
    return this.apiService.getRequest<SunriseSharedConsoleUsers>(
      `${this.basePath}/player/xuid(${xuid})/sharedConsoleUsers`,
    );
  }
  /** Gets console details by XUID. */
  public getConsoleDetailsByXuid(xuid: number): Observable<SunriseConsoleDetails> {
    return this.apiService.getRequest<SunriseConsoleDetails>(
      `${this.basePath}/player/xuid(${xuid})/consoleDetails`,
    );
  }

  /** Updates a console's ban status by the Console's ID. */
  public putBanStatusByConsoleId(consoleId: string, isBanned: boolean): Observable<void> {
    return this.apiService.putRequest<void>(
      `${this.basePath}/console/consoleId(${consoleId})/isBanned(${isBanned})`,
      null,
    );
  }

  /** Gets a player's Profile Summary by XUID. */
  public getProfileSummaryByXuid(xuid: number): Observable<SunriseProfileSummary> {
    return this.apiService.getRequest<SunriseProfileSummary>(
      `${this.basePath}/player/xuid(${xuid})/profileSummary`,
    );
  }

  /** Gets a player's Profile Summary by XUID. */
  public getCreditHistoryByXuid(xuid: number): Observable<SunriseCreditHistory> {
    return this.apiService.getRequest<SunriseCreditHistory>(
      `${this.basePath}/player/xuid(${xuid})/creditUpdates`,
    );
  }
}
