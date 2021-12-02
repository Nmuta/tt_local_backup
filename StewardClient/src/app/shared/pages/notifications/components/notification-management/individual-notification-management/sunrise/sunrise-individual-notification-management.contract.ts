import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { SunriseService } from '@services/sunrise';
import { IndividualNotificationManagementContract } from '../individual-notification-management.contract';

/**
 *  Sunrise individual notification management contract.
 */
@Injectable()
export class SunriseIndividualNotificationManagementContract
  implements IndividualNotificationManagementContract {
  constructor(private readonly sunriseService: SunriseService) {}

  /** Get group notifications. */
  public get getPlayerNotifications$(): IndividualNotificationManagementContract['getPlayerNotifications$'] {
    return this.sunriseService.getPlayerNotifications$.bind(this.sunriseService);
  }

  /** Edit LSP group notification. */
  public get postEditPlayerCommunityMessage$(): IndividualNotificationManagementContract['postEditPlayerCommunityMessage$'] {
    return this.sunriseService.postEditPlayerCommunityMessage$.bind(this.sunriseService);
  }

  /** Delete LSP group notification. */
  public get deletePlayerCommunityMessage$(): IndividualNotificationManagementContract['deletePlayerCommunityMessage$'] {
    return this.sunriseService.deletePlayerCommunityMessage$.bind(this.sunriseService);
  }

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FH4;
  }
}
