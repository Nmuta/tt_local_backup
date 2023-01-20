import { ApolloGiftHistory } from './apollo';
import { MSError } from './error.model';
import { PlayerInventoryItemList } from './master-inventory-item-list';
import { SteelheadGiftHistory } from './steelhead';
import { SunriseGiftHistory } from './sunrise';
import { WoodstockGiftHistory } from './woodstock';

/** Union of all title gift history models. */
export type GiftHistoryResultUnion =
  | WoodstockGiftHistory
  | SteelheadGiftHistory
  | SunriseGiftHistory
  | ApolloGiftHistory;

/** Gift history view model. */
export type GiftHistoryView = {
  descriptionToShow: GiftHistoryDescription[];
  itemsToShow: PlayerInventoryItemList[];
  errors: MSError[];
};

/** Description of a gift history item type.  */
export type GiftHistoryDescription = {
  title: string;
  quantity: number;
};

/** Gift history result union and view alias. */
export type GiftHistoryResultAndView = GiftHistoryResultUnion & GiftHistoryView;
