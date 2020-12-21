import { GameTitleCodeName } from '@models/enums';

/** Defines the title memory model. */
export class TitleMemoryModel {
  /** The title to automatically redirect to on the gifting page. */
  public gifting: GameTitleCodeName;
  public banning: GameTitleCodeName;
}
