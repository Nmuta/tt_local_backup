import { GiftIdentityAntecedent } from '@shared/constants';
import { ApolloPlayerInventory } from './apollo-player-inventory.model';

/** Interface for Apollo gift history. */
export interface ApolloGiftHistory {
  idType: GiftIdentityAntecedent;
  id: BigInt;
  title: string;
  giftSendDateUtc: Date;
  giftInventory: ApolloPlayerInventory;
  requestingAgent: string;
}
