import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateTimeRange } from '@models/datetime-range';
import { PegasusPathInfo } from '@models/pegasus-path-info';
import { WelcomeCenterTileSize } from '@models/welcome-center';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

/** Interface that conditionally displays tile based on current time. */
export interface CalendarHoursCondition {
  time: DateTimeRange;
}

/** Interface that conditionally displays tile based on current date being inside a given range. */
export interface DateRangeCondition {
  range: DateTimeRange;
}

/** Interface that conditionally displays tile based on hours spent playing. */
export interface InGameHoursCondition {
  time: DateTimeRange; // Is this the right type to represent a Timespan?
  lessThanInGameHours: boolean;
}

/** Interface that conditionally displays tile based on scene prior to Welcome Center. */
export interface PreviousUiSceneCondition {
  sceneEnum: string;
}

/** Interface that conditionally displays tile based on count of player sessions. */
export interface SessionsCondition {
  numSessions: number;
  lessThanSessionCount: boolean;
}

/** Represents all valid display conditions on a WelcomeCenter tile. */
export type Condition =
  | CalendarHoursCondition
  | DateRangeCondition
  | InGameHoursCondition
  | PreviousUiSceneCondition
  | SessionsCondition;

/** Enum for referencing the three columns of Welcome Center. */
export enum WelcomeCenterColumn {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

/** Interface that represents a Welcome Center tile. */
export interface WelcomeCenterTile {
  tileTypeV3: string;
  priority: number;
  size: WelcomeCenterTileSize;
  displayConditionDataList: object[]; //Make a real type?
  tileFriendlyName: string;
  tileTitle: string;
  tileType: string;
  tileDescription: string;
  tileImagePath: string;
  tileTelemetryTag: string;
  startEndDateUtc: WelcomeCenterDateTimeRange;
}

/** Interface that represents a DateTime range used by Welcome Center Tiles. */
export interface WelcomeCenterDateTimeRange {
  fromUtc: DateTime;
  toUtc: DateTime;
}

/** Interface that represents the Welcome Center and it's three columns of tiles. */
export interface WelcomeCenter {
  left: WelcomeCenterTile[];
  center: WelcomeCenterTile[];
  right: WelcomeCenterTile[];
}

/** The /v2/steelhead/welcomeCenter endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadWelcomeCenterService {
  private basePath: string = 'title/steelhead/welcomeCenter';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets welcome center tiles for given pegasus path. */
  public getWelcomeCenterTilesByPegasus$(info: PegasusPathInfo): Observable<WelcomeCenter> {
    let httpParams = new HttpParams();

    if (info?.environment) {
      httpParams = httpParams.append('environment', info.environment);
    }

    if (info?.slot) {
      httpParams = httpParams.append('slot', info.slot);
    }

    if (info?.snapshot) {
      httpParams = httpParams.append('snapshot', info.snapshot);
    }

    return this.api.getRequest$<WelcomeCenter>(`${this.basePath}/configuration`, httpParams);
  }

  /** Gets welcome center tiles as seen by user. */
  public getWelcomeCenterTilesByUser$(xuid: BigNumber): Observable<WelcomeCenter> {
    return this.api.getRequest$<WelcomeCenter>(`${this.basePath}/player/${xuid}/configuration`);
  }
}
