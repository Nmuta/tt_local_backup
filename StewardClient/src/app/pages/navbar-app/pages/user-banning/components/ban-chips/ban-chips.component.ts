import { Component, Input } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { PlayerSelectionBaseComponent } from '@navbar-app/components/player-selection/player-selection.base.component';

/** Displays identity result chips in a way that works for  */
@Component({
  selector: 'ban-chips',
  templateUrl: './ban-chips.component.html',
  styleUrls: ['./ban-chips.component.scss']
})
export class BanChipsComponent {
  @Input() public playerSelection: PlayerSelectionBaseComponent<IdentityResultAlpha | IdentityResultBeta> = null;

  public closeIcon = faTimesCircle;
}
