import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { PlayFabBuildLock, PlayFabBuildLockRequest, PlayFabBuildSummary } from '@models/playfab';
import { WoodstockPlayFabEnvironments } from '@models/woodstock';
import { WoodstockPlayFabBuildsService } from '@services/api-v2/woodstock/playfab/builds/woodstock-playfab-builds.service';
import { Observable } from 'rxjs';
import { PlayFabBuildsManagementServiceContract } from '../playfab-builds-management.component';

/** Displays the playfab-builds management tool. */
@Component({
  selector: 'woodstock-playfab-builds-management',
  templateUrl: './woodstock-playfab-builds-management.component.html',
  styleUrls: ['./woodstock-playfab-builds-management.component.scss'],
})
export class WoodstockPlayFabBuildsManagementComponent {
  public service: PlayFabBuildsManagementServiceContract;

  constructor(woodstockPlayFabBuildsService: WoodstockPlayFabBuildsService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayFabBuilds$(): Observable<PlayFabBuildSummary[]> {
        return woodstockPlayFabBuildsService.getBuilds$(WoodstockPlayFabEnvironments.Dev);
      },
      getPlayFabBuildLocks$(): Observable<PlayFabBuildLock[]> {
        return woodstockPlayFabBuildsService.getBuildLocks$(WoodstockPlayFabEnvironments.Dev);
      },
      addPlayFabBuildLock$(buildLockRequest: PlayFabBuildLockRequest) {
        return woodstockPlayFabBuildsService.addBuildLock$(
          WoodstockPlayFabEnvironments.Dev,
          buildLockRequest,
        );
      },
      deletePlayFabBuildLock$(buildLockId: GuidLikeString) {
        return woodstockPlayFabBuildsService.deleteBuildLock$(
          WoodstockPlayFabEnvironments.Dev,
          buildLockId,
        );
      },
    };
  }
}
