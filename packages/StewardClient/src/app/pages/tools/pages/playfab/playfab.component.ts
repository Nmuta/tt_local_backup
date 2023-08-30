import { Component } from '@angular/core';
import { getPlayFabRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { InvalidPermActionType } from '@shared/modules/permissions/directives/permission-attribute.base.directive';

/** Displays the Steward PlayFab tool. */
@Component({
  templateUrl: './playfab.component.html',
  styleUrls: ['./playfab.component.scss'],
})
export class PlayFabComponent {
  public PermAttributeName = PermAttributeName;
  public InvalidPermActionType = InvalidPermActionType;

  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.Forte,
      codename: GameTitleCodeName.Forte,
      route: getPlayFabRoute(GameTitle.Forte),
      permissionAttribute: PermAttributeName.TitleAccess,
      permissionTitle: GameTitle.FM8,
      permissionInvalidActionType: InvalidPermActionType.Hide,
    },
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: getPlayFabRoute(GameTitle.FH5),
    },
  ];
}
