import { Injectable } from '@angular/core';
import { DateTimeRange } from '@models/datetime-range';
import { WelcomeCenterTileSize } from '@models/welcome-center';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { Observable } from 'rxjs';

export interface CalendarHoursCondition {
  time: DateTimeRange; // Is this the right type to represent a Timespan?
}

export interface DateRangeCondition {
  range: DateTimeRange;
}

export interface InGameHoursCondition {
  time: DateTimeRange; // Is this the right type to represent a Timespan?
  lessThanInGameHours: boolean;
}

export interface PreviousUiSceneCondition {
  sceneEnum: string;
}

export interface SessionsCondition {
  numSessions: number;
  lessThanSessionCount: boolean;
}

export type Condition =
  | CalendarHoursCondition
  | DateRangeCondition
  | InGameHoursCondition
  | PreviousUiSceneCondition
  | SessionsCondition;

export enum WelcomeCenterColumn {
  Left = 'left',
  Center = 'center',
  Right = 'right',
}

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
}

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

  /** Gets the Steelhead lsp groups. */
  public getWelcomeCenterTiles$(): Observable<WelcomeCenter> {
    return this.api.getRequest$<WelcomeCenter>(`${this.basePath}`);
  }
}
