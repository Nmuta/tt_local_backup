import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faGavel, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { SunriseBanSummary } from '@models/sunrise';
import { PlayerSelectionBaseComponent } from '@navbar-app/components/player-selection/player-selection.base.component';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

export interface BanQuery {
  isLoading: boolean;
  loadError: boolean;
  banList: unknown[];
}

/** Displays the ban chip icons for a given identity/query. */
@Component({
  selector: 'ban-chip-icon',
  templateUrl: './ban-chip-icon.component.html',
  styleUrls: ['./ban-chip-icon.component.scss']
})
export class BanChipIconComponent extends BaseComponent implements OnChanges {
  @Input() public identity: IdentityResultAlpha | IdentityResultBeta = null;
  @Input() public banSummary: SunriseBanSummary = null;
  @Input() public banQuery: BanQuery = null;
  @Output() public gavelClick = new EventEmitter<BanChipIconComponent>();

  public spinnerIcon = faSpinner;
  public bannedIcon = faGavel;

  public hasBans = false;
  public banCount: BigInt = BigInt(0);

  constructor() {
    super();
  }

  /** Angular hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    if (this.banSummary) {
      this.banCount = this.banSummary.banCount
      this.hasBans = this.banSummary.banCount > BigInt(0);
    } else {
      this.banCount = BigInt(0);
      this.hasBans = false;
    }
  }

  /** Fires when the gavel icon is clicked. */
  public onGavelClick(): void {
    this.gavelClick.emit(this);
  }
}
