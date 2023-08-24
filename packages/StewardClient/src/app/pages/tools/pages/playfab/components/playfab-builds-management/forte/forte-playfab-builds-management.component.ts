import { Component } from '@angular/core';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { PlayFabBuildLock, PlayFabBuildSummary } from '@models/playfab';
import { FortePlayFabBuildsService } from '@services/api-v2/forte/playfab/builds/forte-playfab-builds.service';
import { Observable } from 'rxjs';
import { PlayFabBuildsManagementServiceContract } from '../playfab-builds-management.component';

/** Displays the playfab-builds management tool. */
@Component({
  selector: 'forte-playfab-builds-management',
  templateUrl: './forte-playfab-builds-management.component.html',
  styleUrls: ['./forte-playfab-builds-management.component.scss'],
})
export class FortePlayFabBuildsManagementComponent {
  public service: PlayFabBuildsManagementServiceContract;

  constructor(fortePlayFabBuildsService: FortePlayFabBuildsService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayFabBuilds$(): Observable<PlayFabBuildSummary[]> {
        return fortePlayFabBuildsService.getBuilds$();
      },
      getPlayFabBuildLocks$(): Observable<PlayFabBuildLock[]> {
        return fortePlayFabBuildsService.getBuildLocks$();
      },
      addPlayFabBuildLock$(buildLockId: GuidLikeString, reason: string) {
        return fortePlayFabBuildsService.addBuildLock$(buildLockId, reason);
      },
      deletePlayFabBuildLock$(buildLockId: GuidLikeString) {
        return fortePlayFabBuildsService.deleteBuildLock$(buildLockId);
      },
    };
  }
}
