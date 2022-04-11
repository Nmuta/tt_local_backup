import { GameTitleCodeName } from '@models/enums';

/* eslint-disable @typescript-eslint/no-unused-vars */

type Horizons = GameTitleCodeName.FH4 | GameTitleCodeName.FH5;
type Motorsports = GameTitleCodeName.FM7 | GameTitleCodeName.FM8;
type Everything = Horizons | Motorsports | GameTitleCodeName.Street;
type Newer = Horizons | GameTitleCodeName.FM8;
type EverythingSansStreet = Exclude<Everything, GameTitleCodeName.Street>;
type General = 'General';

/** Defines the title memory model. */
export class TitleMemoryModel {
  /** The title to automatically redirect to on the tooling page. */
  public gifting: Everything;
  public banning: EverythingSansStreet;
  public giftHistory: Everything;
  public userDetails: Everything | General;
  public ugc: Horizons;
  public ugcDetails: Horizons;
  public notifications: Horizons;
  public auctionBlocklist: Horizons;
  public auctionDetails: Horizons;
  public leaderboards: GameTitleCodeName.FH5;
  public racersCup: GameTitleCodeName.FM8;
}
