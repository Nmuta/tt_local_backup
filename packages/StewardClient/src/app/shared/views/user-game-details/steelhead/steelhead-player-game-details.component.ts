import BigNumber from 'bignumber.js';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { GameTitle } from '@models/enums';
import { PlayerGameDetailsContract } from '../player-game-details.base.component';
import { SteelheadPlayerGameDetailsService } from '@services/api-v2/steelhead/player/game-details/steelhead-player-game-details.service';
import { PlayerGameDetails } from '@models/player-game-details.model';
import { BaseComponent } from '@components/base-component/base.component';
import { IdentityResultUnion } from '@models/identity-query.model';

/** Retrieves and displays Steelhead Player Game Details by XUID. */
@Component({
  selector: 'steelhead-player-game-details',
  templateUrl: './steelhead-player-game-details.component.html',
  styleUrls: ['./steelhead-player-game-details.component.scss'],
})
export class SteelheadPlayerGameDetailsComponent extends BaseComponent {
  /** The identity to look up. If the identity does not have a XUID nothing will happen. */
  @Input() public identity: IdentityResultUnion;

  public service: PlayerGameDetailsContract;

  constructor(steelheadPlayerGameDetailsService: SteelheadPlayerGameDetailsService) {
    super();

    this.service = {
      gameTitle: GameTitle.FM8,
      getPlayerGameDetails$(xuid: BigNumber): Observable<PlayerGameDetails> {
        return steelheadPlayerGameDetailsService.getUserGameDetails$(xuid);
      },
    };
  }
}
