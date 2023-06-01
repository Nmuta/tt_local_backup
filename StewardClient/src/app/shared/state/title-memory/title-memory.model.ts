import { GameTitleCodeName } from '@models/enums';

/* eslint-disable @typescript-eslint/no-unused-vars */

type Horizons = GameTitleCodeName.FH4 | GameTitleCodeName.FH5;
type Motorsports = GameTitleCodeName.FM7 | GameTitleCodeName.FM8;
type Everything = Horizons | Motorsports;
type Newer = Horizons | GameTitleCodeName.FM8;
type General = 'General';

/** Defines the title memory model. */
export class TitleMemoryModel {
  /** The title to automatically redirect to on the tooling page. */
  public gifting: Everything;
  public banning: Everything;
  public giftHistory: Everything;
  public userDetails: Everything | General;
  public ugc: Horizons;
  public ugcDetails: Horizons;
  public notifications: Horizons;
  public auctionBlocklist: Horizons;
  public auctionDetails: Horizons;
  public leaderboards: GameTitleCodeName.FH5;
  public racersCup: GameTitleCodeName.FM8;
  public userGroupManagement: GameTitleCodeName.FH5;
  public carDetails: GameTitleCodeName.FH5;
  public welcomeCenterCalendar: GameTitleCodeName.FM8;
  public messageOfTheDay: GameTitleCodeName.FM8;
  public createAuction: GameTitleCodeName.FH5;
  public welcomeCenterTiles: GameTitleCodeName.FM8;
  public servicesTableStorage: GameTitleCodeName.FM8;
  public showroomCalendar: GameTitleCodeName.FM8;
  public acLogReader: GameTitleCodeName.FM8;
}
