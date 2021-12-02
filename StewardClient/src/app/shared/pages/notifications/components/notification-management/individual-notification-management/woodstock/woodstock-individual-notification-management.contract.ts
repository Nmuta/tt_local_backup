import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IndividualNotificationManagementContract } from '../individual-notification-management.contract';
import { WoodstockService } from '@services/woodstock';

/**
 *  Woodstock individual notification management contract.
 */
@Injectable()
export class WoodstockIndividualNotificationManagementContract
  implements IndividualNotificationManagementContract {
  constructor(private readonly woodstockService: WoodstockService) {}

  /** Get group notifications. */
  public get getPlayerNotifications$(): IndividualNotificationManagementContract['getPlayerNotifications$'] {
    return this.woodstockService.getPlayerNotifications$.bind(this.woodstockService);
  }

  /** Edit LSP group notification. */
  public get postEditPlayerCommunityMessage$(): IndividualNotificationManagementContract['postEditPlayerCommunityMessage$'] {
    return this.woodstockService.postEditPlayerCommunityMessage$.bind(this.woodstockService);
  }

  /** Delete LSP group notification. */
  public get deletePlayerCommunityMessage$(): IndividualNotificationManagementContract['deletePlayerCommunityMessage$'] {
    return this.woodstockService.deletePlayerCommunityMessage$.bind(this.woodstockService);
  }

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FH5;
  }
}
