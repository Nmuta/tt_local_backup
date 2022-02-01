import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { GroupNotificationManagementContract } from '../group-notification-management.contract';
import { WoodstockService } from '@services/woodstock';
/**
 *  Woodstock group notification management contract.
 */
@Injectable()
export class WoodstockGroupNotificationManagementContract
  implements GroupNotificationManagementContract
{
  constructor(private readonly woodstockService: WoodstockService) {}

  /** Get group notifications. */
  public get getGroupNotifications$(): GroupNotificationManagementContract['getGroupNotifications$'] {
    return this.woodstockService.getGroupNotifications$.bind(this.woodstockService);
  }

  /** Edit LSP group notification. */
  public get postEditLspGroupCommunityMessage$(): GroupNotificationManagementContract['postEditLspGroupCommunityMessage$'] {
    return this.woodstockService.postEditLspGroupCommunityMessage$.bind(this.woodstockService);
  }

  /** Delete LSP group notification. */
  public get deleteLspGroupCommunityMessage$(): GroupNotificationManagementContract['deleteLspGroupCommunityMessage$'] {
    return this.woodstockService.deleteLspGroupCommunityMessage$.bind(this.woodstockService);
  }

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FH5;
  }
}
