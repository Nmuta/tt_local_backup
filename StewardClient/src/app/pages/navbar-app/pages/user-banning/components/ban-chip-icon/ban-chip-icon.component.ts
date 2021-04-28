import BigNumber from 'bignumber.js';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { faGavel } from '@fortawesome/free-solid-svg-icons';
import { IdentityResultUnion } from '@models/identity-query.model';
import { SunriseBanSummary } from '@models/sunrise';

export interface BanQuery {
  isLoading: boolean;
  loadError: boolean;
  banList: unknown[];
}

/** Displays the ban chip icons for a given identity/query. */
@Component({
  selector: 'ban-chip-icon',
  templateUrl: './ban-chip-icon.component.html',
  styleUrls: ['./ban-chip-icon.component.scss'],
})
export class BanChipIconComponent extends BaseComponent implements OnChanges {
  @Input() public identity: IdentityResultUnion = null;
  @Input() public banSummary: SunriseBanSummary = null;
  @Input() public banQuery: BanQuery = null;
  @Output() public gavelClick = new EventEmitter<BanChipIconComponent>();

  public bannedIcon = faGavel;

  public hasBans = false;
  public banCount: BigNumber = new BigNumber(0);

  constructor() {
    super();
  }

  /** Angular hook. */
  public ngOnChanges(_changes: SimpleChanges): void {
    if (this.banSummary) {
      this.banCount = this.banSummary.banCount;
      this.hasBans = this.banSummary.banCount > new BigNumber(0);
    } else {
      this.banCount = new BigNumber(0);
      this.hasBans = false;
    }
  }

  /** Fires when the gavel icon is clicked. */
  public onGavelClick(): void {
    this.gavelClick.emit(this);
  }
}
