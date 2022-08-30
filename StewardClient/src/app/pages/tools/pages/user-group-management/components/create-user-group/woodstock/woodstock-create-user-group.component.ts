import { Component, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { LspGroup } from '@models/lsp-group';
import { Observable } from 'rxjs';
import { CreateUserGroupServiceContract } from '../create-user-group.component';
import { WoodstockUserGroupService } from '@services/api-v2/woodstock/user-group/woodstock-user-group.service';
import { GameTitle } from '@models/enums';

/** Tool that creates new user groups. */
@Component({
  selector: 'woodstock-create-user-group',
  templateUrl: './woodstock-create-user-group.component.html',
  styleUrls: ['./woodstock-create-user-group.component.scss'],
})
export class WoodstockCreateUserGroupComponent extends BaseComponent {
  /** Outputs when a new user group is created */
  @Output() newUserGroup = new EventEmitter<LspGroup>();

  public service: CreateUserGroupServiceContract;

  constructor(userGroupService: WoodstockUserGroupService) {
    super();

    this.service = {
      gameTitle: GameTitle.FH5,
      createUserGroup$(groupName: string): Observable<LspGroup> {
        return userGroupService.createUserGroup$(groupName);
      },
    };
  }
}
