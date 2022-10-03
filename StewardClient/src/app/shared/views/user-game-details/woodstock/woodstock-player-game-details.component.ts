import BigNumber from 'bignumber.js';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { GameTitle } from '@models/enums';
import { PlayerGameDetailsContract } from '../player-game-details.base.component';
import { WoodstockPlayerService } from '@services/api-v2/woodstock/player/woodstock-player.service';
import { PlayerGameDetails } from '@models/player-game-details.model';
import { IdentityResultUnion } from '@models/identity-query.model';
import { BaseComponent } from '@components/base-component/base.component';

/** Retrieves and displays Woodstock Player Game Details by XUID. */
@Component({
  selector: 'woodstock-player-game-details',
  templateUrl: './woodstock-player-game-details.component.html',
  styleUrls: ['./woodstock-player-game-details.component.scss'],
})
export class WoodstockPlayerGameDetailsComponent extends BaseComponent {
  /** The identity to look up. If the identity does not have a XUID nothing will happen. */
  @Input() public identity: IdentityResultUnion;

  public service: PlayerGameDetailsContract;

  constructor(woodstockPlayerService: WoodstockPlayerService) {
    super();

    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayerGameDetails$(xuid: BigNumber): Observable<PlayerGameDetails> {
        return woodstockPlayerService.getUserGameDetails$(xuid);
      },
    };
  }
}
