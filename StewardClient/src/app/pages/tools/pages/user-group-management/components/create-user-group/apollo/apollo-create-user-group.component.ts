import { Component, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { ApolloUserGroupService } from '@services/api-v2/apollo/user-group/apollo-user-group.service';
import { Observable } from 'rxjs';
import { CreateUserGroupServiceContract } from '../create-user-group.component';

/** Tool that creates new user groups. */
@Component({
  selector: 'apollo-create-user-group',
  templateUrl: './apollo-create-user-group.component.html',
  styleUrls: ['./apollo-create-user-group.component.scss'],
})
export class ApolloCreateUserGroupComponent extends BaseComponent {
  /** Outputs when a new user group is created */
  @Output() newUserGroup = new EventEmitter<LspGroup>();

  public service: CreateUserGroupServiceContract;

  constructor(userGroupService: ApolloUserGroupService) {
    super();

    this.service = {
      gameTitle: GameTitle.FM7,
      createUserGroup$(groupName: string): Observable<LspGroup> {
        return userGroupService.createUserGroup$(groupName);
      },
    };
  }
}
