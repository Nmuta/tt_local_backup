import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { PlayFabBuildLock, PlayFabBuildSummary } from '@models/playfab';
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
        return woodstockPlayFabBuildsService.getBuilds$();
      },
      getPlayFabBuildLocks$(): Observable<PlayFabBuildLock[]> {
        return woodstockPlayFabBuildsService.getBuildLocks$();
      },
      addPlayFabBuildLock$(buildLockId: GuidLikeString, reason: string) {
        return woodstockPlayFabBuildsService.addBuildLock$(buildLockId, reason);
      },
      deletePlayFabBuildLock$(buildLockId: GuidLikeString) {
        return woodstockPlayFabBuildsService.deleteBuildLock$(buildLockId);
      },
    };
  }
}
