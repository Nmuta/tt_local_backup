import { GameTitleCodeName } from '@models/enums';

/** Defines the title memory model. */
export class TitleMemoryModel {
  /** The title to automatically redirect to on the tooling page. */
  public gifting: GameTitleCodeName;
  public banning: GameTitleCodeName;
  public giftHistory: GameTitleCodeName;
  public userDetails: GameTitleCodeName;
  public ugc: GameTitleCodeName;
  public notifications: GameTitleCodeName;
  public auctionBlocklist: GameTitleCodeName;
}
