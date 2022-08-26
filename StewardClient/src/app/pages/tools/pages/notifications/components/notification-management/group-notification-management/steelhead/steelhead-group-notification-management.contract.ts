import { Injectable } from '@angular/core';
import { GameTitle } from '@models/enums';
import { GroupNotificationManagementContract } from '../group-notification-management.contract';
import { SteelheadGroupMessagesService } from '@services/api-v2/steelhead/group/messages/steelhead-group-messages.service';
/**
 *  Steelhead group notification management contract.
 */
@Injectable()
export class SteelheadGroupNotificationManagementContract
  implements GroupNotificationManagementContract
{
  constructor(private readonly steelheadGroupMessagesService: SteelheadGroupMessagesService) {}

  /** Get group notifications. */
  public get getGroupNotifications$(): GroupNotificationManagementContract['getGroupNotifications$'] {
    return this.steelheadGroupMessagesService.getGroupNotifications$.bind(
      this.steelheadGroupMessagesService,
    );
  }

  /** Edit LSP group notification. */
  public get postEditLspGroupCommunityMessage$(): GroupNotificationManagementContract['postEditLspGroupCommunityMessage$'] {
    return this.steelheadGroupMessagesService.postEditLspGroupCommunityMessage$.bind(
      this.steelheadGroupMessagesService,
    );
  }

  /** Delete LSP group notification. */
  public get deleteLspGroupCommunityMessage$(): GroupNotificationManagementContract['deleteLspGroupCommunityMessage$'] {
    return this.steelheadGroupMessagesService.deleteLspGroupCommunityMessage$.bind(
      this.steelheadGroupMessagesService,
    );
  }

  /** Gets the game title. */
  public getGameTitle(): GameTitle {
    return GameTitle.FM8;
  }
}
