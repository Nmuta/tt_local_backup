import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { SunriseService } from '@services/sunrise';
import { GroupNotificationManagementContract } from '../group-notification-management.contract';

/**
 *  Sunrise group notification management contract.
 */
@Injectable()
export class SunriseGroupNotificationManagementContract
  implements GroupNotificationManagementContract
{
  constructor(private readonly sunriseService: SunriseService) {}

  /** Get group notifications. */
  public get getGroupNotifications$(): GroupNotificationManagementContract['getGroupNotifications$'] {
    return this.sunriseService.getGroupNotifications$.bind(this.sunriseService);
  }

  /** Edit LSP group notification. */
  public get postEditLspGroupCommunityMessage$(): GroupNotificationManagementContract['postEditLspGroupCommunityMessage$'] {
    return this.sunriseService.postEditLspGroupCommunityMessage$.bind(this.sunriseService);
  }

  /** Delete LSP group notification. */
  public get deleteLspGroupCommunityMessage$(): GroupNotificationManagementContract['deleteLspGroupCommunityMessage$'] {
    return this.sunriseService.deleteLspGroupCommunityMessage$.bind(this.sunriseService);
  }

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FH4;
  }
}
