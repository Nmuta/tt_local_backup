import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { SteelheadPlayerMessagesService } from '@services/api-v2/steelhead/player/messages/steelhead-player-messages.service';
import { IndividualNotificationManagementContract } from '../individual-notification-management.contract';

/**
 *  Steelhead individual notification management contract.
 */
@Injectable()
export class SteelheadIndividualNotificationManagementContract
  implements IndividualNotificationManagementContract
{
  constructor(private readonly steelheadPlayerMessagesService: SteelheadPlayerMessagesService) {}

  /** Get group notifications. */
  public get getPlayerNotifications$(): IndividualNotificationManagementContract['getPlayerNotifications$'] {
    return this.steelheadPlayerMessagesService.getPlayerNotifications$.bind(
      this.steelheadPlayerMessagesService,
    );
  }

  /** Edit LSP group notification. */
  public get postEditPlayerCommunityMessage$(): IndividualNotificationManagementContract['postEditPlayerCommunityMessage$'] {
    return this.steelheadPlayerMessagesService.postEditPlayerCommunityMessage$.bind(
      this.steelheadPlayerMessagesService,
    );
  }

  /** Delete LSP group notification. */
  public get deletePlayerCommunityMessage$(): IndividualNotificationManagementContract['deletePlayerCommunityMessage$'] {
    return this.steelheadPlayerMessagesService.deletePlayerCommunityMessage$.bind(
      this.steelheadPlayerMessagesService,
    );
  }

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FM8;
  }
}
